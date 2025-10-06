const express = require('express');
const User = require('../models/User');
const router = express.Router();

// 获取所有用户
router.get('/',async(req, res) => {
    // 从数据库获取用户列表（这里使用静态数据作为示例）
    try {
        const users = await User.find();
        res.json({
            message: "获取用户列表成功",
            data: users
        });
    } catch (error) {
        res.status(500).json({ 
            message: '获取用户列表失败', 
            error: error.message });
    }

});

// 根据ID获取单个用户
router.get('/:id',async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        res.json({
            message: `获取用户 ${req.params.id} 成功`,
            data: user
        });
    } catch (error) {
        res.status(500).json({ 
            message: '获取用户失败', 
            error: error.message });
    }

});

// 创建新用户
router.post('/',async(req, res) => {
    try {
        const { name, email, role } = req.body;
        const newUser = new User({ name, email, role });
        const savedUser = await newUser.save();
        res.status(201).json({
            message: "用户创建成功",
            data: savedUser
        });
    } catch (error) {
        res.status(400).json({ 
            message: '创建用户失败', 
            error: error.message });
    }
});

module.exports = router;
