const express = require('express');
const Document = require('../models/Document');
const router = express.Router();
const Annotation = require('../models/Annotation');
const User = require('../models/User');
const PracticalSegmenter = require('../utils/segmenter');
const { status } = require('express/lib/response');
const segmenter = new PracticalSegmenter();

router.post('/segment-text', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: '文本内容不能为空' });
        }

        const segments = segmenter.segment(text);

        res.json({
            message: '文本分词成功',
            data: {
                segments,
                originalText: text
            }
        });
    } catch (error) {
        res.status(500).json({
            message: '文本分词失败',
            error: error.message
        });
    }           
});

router.post('/segment-document/:documentId', async (req, res) => {
    try {
        const { documentId } = req.params;
        const { authorId } = req.body;
        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ message: '文档不存在' });
        }

        let actualAuthorId = authorId;
        if (!actualAuthorId) {
            const user = await User.findOne(); // 获取第一个用户
            actualAuthorId = user ? user._id : '65d8f1a9e4b0c8a9d8f1a9e4';
        }

        const segments = segmenter.segment(document.content);

        // 创建标注
        const annotationsData = segments.map(segment => ({
            document: documentId,
            author: actualAuthorId,
            content: segment.content,
            startIndex: segment.startIndex,
            endIndex: segment.endIndex,
            type: segment.type,
            partOfSpeech: segment.partOfSpeech,
            semanticTag: segment.semanticTag,
            isAuto: true,
            confidence: segment.confidence,
            status: 'pending'
        }));

        const createdAnnotations = await Annotation.insertMany(annotationsData);

        // 更新文档的标注计数
        await Document.findByIdAndUpdate(documentId, {
            annotationCount: createdAnnotations.length
        });

        res.json({
            message: '文档分词并创建标注成功',
            data: {
                document: document.title,
                segments: savedAnnotations.length,
                annotations: savedAnnotations
            }
        });
    } catch (error) {
        res.status(500).json({
            message: '文档分词失败',
            error: error.message
        });
    }   
});

module.exports = router;