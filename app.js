const express = require('express');
const connectDB = require('./config/database');

const app = express();
const port = 3000;

// 连接数据库
connectDB();

// 中间件
app.use(express.json());

// 导入路由
const userRoutes = require('./routes/users');
const documentRoutes = require('./routes/documents');
const annotationRoutes = require('./routes/annotations');
const segmentationRoutes = require('./routes/segmentation');

// 使用路由
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/annotations', annotationRoutes);
app.use('/api/segmentation', segmentationRoutes);

// 基础路由
app.get('/', (req, res) => {
  res.json({
    message: "Hello, 古汉语服务器！",
    status: "运行正常",
    version: "1.0.0",
    database: "MongoDB 已连接",
    endpoints: {
      home: "GET /",
      health: "GET /health",
      users: "GET /api/users",
      user_detail: "GET /api/users/:id",
      documents: "GET /api/documents",
      document_detail: "GET /api/documents/:id",
      annotations: "GET /api/annotations/document/:documentId", // 新增标注端点
      annotation_detail: "GET /api/annotations/:id",
      create_annotation: "POST /api/annotations",
      batch_annotations: "POST /api/annotations/batch",
      segment_text: "POST /api/segmentation/segment-text",
      segment_document: "POST /api/segmentation/segment-document/;id"
    }
  });
});

app.get('/health', (req, res) => {
    const mongoose = require('mongoose');
    res.json({ status: '服务器运行正常',
         timestamp: new Date().toISOString(),
         database:mongoose.connection.readyState === 1 ? '已连接' : '未连接'
     });
});



app.listen(port, () => {
  console.log(`=================================`);
  console.log(`🚀 服务器已成功启动！`);
  console.log(`📍 运行地址: http://localhost:${port}`);
  console.log(`⏰ 启动时间: ${new Date().toLocaleString()}`);
  console.log(`=================================`);
});