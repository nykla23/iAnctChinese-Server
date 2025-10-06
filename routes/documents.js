const express = require('express');
const Document = require('../models/Document');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const documents = await Document.find().populate('author', 'name email').sort({ createdAt: -1 });   
        res.json({
            message: '获取文档列表成功',
            data: documents,
            count : documents.length
        });
    } catch (error) {
        res.status(500).json({ 
            message: '获取文档列表失败', 
            error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const document = await Document.findById(req.params.id).populate('author', 'name email');
        if (!document) {
            return res.status(404).json({ message: '文档不存在' });
        }
        res.json({
            message: '获取文档成功',
            data: document
        });
    } catch (error) {
        res.status(500).json({ 
            message: '获取文档失败', 
            error: error.message });
    }   
});

router.post('/', async (req, res) => {
    try {
        const { title, content, description, tags, } = req.body;
        const authorId = req.body.authorId || '65d8f1a9e4b0c8a9d8f1a9e4'; // 临时测试用
        const newDocument = new Document({ title, content, description, tags, author: authorId });
        const savedDocument = await newDocument.save();
        res.status(201).json({
            message: '文档创建成功',
            data: savedDocument
        });
    } catch (error) {
        res.status(400).json({ 
            message: '创建文档失败', 
            error: error.message });
    }   
});

router.put('/:id', async (req, res) => {
    try {
        const { title, content, description, tags, status } = req.body;
        const updatedDocument = await Document.findByIdAndUpdate(
            req.params.id,
            { title, content, description, tags, status, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!updatedDocument) {
            return res.status(404).json({ message: '文档不存在' });
        }   
        res.json({
            message: '文档更新成功',
            data: updatedDocument
        });
    } catch (error) {
        res.status(400).json({ 
            message: '更新文档失败', 
            error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedDocument = await Document.findByIdAndDelete(req.params.id);
        if (!deletedDocument) {
            return res.status(404).json({ message: '文档不存在' });
        }
        res.json({
            message: '文档删除成功',
            data: deletedDocument
        });
    } catch (error) {
        res.status(500).json({ 
            message: '删除文档失败', 
            error: error.message });
    }
});
module.exports = router;
