const express = require('express');
const Annotation = require('../models/Annotation');
const Document = require('../models/Document');
const User = require('../models/User');
const router = express.Router();

// 获取文档的所有标注
router.get('/document/:documentId', async (req, res) => {
  try {
    const annotations = await Annotation.find({ 
      document: req.params.documentId 
    })
    .populate('author', 'name')
    .sort({ startIndex: 1 }); // 按起始位置排序

    res.json({
      message: "获取标注列表成功",
      count: annotations.length,
      data: annotations
    });
  } catch (error) {
    res.status(500).json({
      message: "获取标注列表失败",
      error: error.message
    });
  }
});

// 获取单个标注
router.get('/:id', async (req, res) => {
  try {
    const annotation = await Annotation.findById(req.params.id)
      .populate('document', 'title')
      .populate('author', 'name');

    if (!annotation) {
      return res.status(404).json({
        message: "标注不存在"
      });
    }

    res.json({
      message: "获取标注成功",
      data: annotation
    });
  } catch (error) {
    res.status(500).json({
      message: "获取标注失败",
      error: error.message
    });
  }
});

// 创建新标注
router.post('/', async (req, res) => {
  try {
    const { 
      documentId, 
      content, 
      startIndex, 
      endIndex, 
      type, 
      partOfSpeech, 
      semanticTag, 
      explanation 
    } = req.body;

    // 验证文档是否存在
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({
        message: "文档不存在"
      });
    }

  
    let authorId = req.body.authorId;

    if (!authorId) {
        const user = await USer.findOne(); // 获取第一个用户
        if (!user) {
            const newUser = new USer({ 
                name: '默认用户',
                email: "default@example.com",
                role: "研究员"
            });
            await newUser.save();
            authorId = newUser._id;
        } else {
            authorId = user._id;
        }
    }

    const newAnnotation = new Annotation({
      document: documentId,
      author: authorId,
      content,
      startIndex,
      endIndex,
      type,
      partOfSpeech,
      semanticTag,
      explanation
    });

    const savedAnnotation = await newAnnotation.save();

    // 更新文档的标注计数
    await Document.findByIdAndUpdate(documentId, {
      $inc: { annotationCount: 1 }
    });

    res.status(201).json({
      message: "创建标注成功",
      data: savedAnnotation
    });
  } catch (error) {
    res.status(400).json({
      message: "创建标注失败",
      error: error.message
    });
  }
});

// 批量创建标注（用于自动分词结果）
router.post('/batch', async (req, res) => {
  try {
    const { documentId, annotations } = req.body;

    // 验证文档是否存在
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({
        message: "文档不存在"
      });
    }

    let authorId = req.body.authorId;
    if (!authorId) {
        const user = await User.findOne(); // 获取第一个用户
        authorId = user ? user._id : '65d8f1a9e4b0c8a9d8f1a9e4';
    }

    // 为每个标注添加文档和作者信息
    const annotationsWithMeta = annotations.map(annotation => ({
      ...annotation,
      document: documentId,
      author: authorId,
      isAuto: true,
      confidence: annotation.confidence || 0.8
    }));

    const savedAnnotations = await Annotation.insertMany(annotationsWithMeta);

    // 更新文档的标注计数
    await Document.findByIdAndUpdate(documentId, {
      $inc: { annotationCount: savedAnnotations.length }
    });

    res.status(201).json({
      message: "批量创建标注成功",
      count: savedAnnotations.length,
      data: savedAnnotations
    });
  } catch (error) {
    res.status(400).json({
      message: "批量创建标注失败",
      error: error.message
    });
  }
});

// 更新标注
router.put('/:id', async (req, res) => {
  try {
    const { content, partOfSpeech, semanticTag, explanation, status } = req.body;

    const updatedAnnotation = await Annotation.findByIdAndUpdate(
      req.params.id,
      {
        content,
        partOfSpeech,
        semanticTag,
        explanation,
        status,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!updatedAnnotation) {
      return res.status(404).json({
        message: "标注不存在"
      });
    }

    res.json({
      message: "更新标注成功",
      data: updatedAnnotation
    });
  } catch (error) {
    res.status(400).json({
      message: "更新标注失败",
      error: error.message
    });
  }
});

// 删除标注
router.delete('/:id', async (req, res) => {
  try {
    const annotation = await Annotation.findById(req.params.id);
    
    if (!annotation) {
      return res.status(404).json({
        message: "标注不存在"
      });
    }

    await Annotation.findByIdAndDelete(req.params.id);

    // 更新文档的标注计数
    await Document.findByIdAndUpdate(annotation.document, {
      $inc: { annotationCount: -1 }
    });

    res.json({
      message: "删除标注成功",
      data: annotation
    });
  } catch (error) {
    res.status(500).json({
      message: "删除标注失败",
      error: error.message
    });
  }
});

module.exports = router;