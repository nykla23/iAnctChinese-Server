const mongoose = require('mongoose');

// 定义标注数据模型
const annotationSchema = new mongoose.Schema({
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document', // 关联文档
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 关联用户
    required: true
  },
  // 标注的内容（可能是词、短语或句子）
  content: {
    type: String,
    required: true,
    trim: true
  },
  // 在原文中的起始位置
  startIndex: {
    type: Number,
    required: true,
    min: 0
  },
  // 在原文中的结束位置
  endIndex: {
    type: Number,
    required: true,
    min: 0
  },
  // 标注类型：word-词语, phrase-短语, sentence-句子, punctuation-标点
  type: {
    type: String,
    enum: ['word', 'phrase', 'sentence', 'punctuation'],
    required: true
  },
  // 词性标注（如果是词语）
  partOfSpeech: {
    type: String,
    trim: true
  },
  // 语义标注
  semanticTag: {
    type: String,
    trim: true
  },
  // 注释或解释
  explanation: {
    type: String,
    trim: true
  },
  // 标注置信度（用于自动标注）
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 1
  },
  // 是否为自动标注
  isAuto: {
    type: Boolean,
    default: false
  },
  // 标注状态：pending-待审核, approved-已审核, rejected-已拒绝
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 创建索引以提高查询性能
annotationSchema.index({ document: 1, startIndex: 1 });
annotationSchema.index({ author: 1 });
annotationSchema.index({ type: 1 });

// 在保存前验证索引范围
annotationSchema.pre('save', function(next) {
  if (this.startIndex >= this.endIndex) {
    return next(new Error('起始索引必须小于结束索引'));
  }
  this.updatedAt = Date.now();
  next();
});

const Annotation = mongoose.model('Annotation', annotationSchema);

module.exports = Annotation;  // 确保只有这一行在文件末尾
