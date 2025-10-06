const { status } = require('express/lib/response');
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'请输入文档标题'],
        trim:true,
    }   ,
    content:{
        type:String,
        required:[true,'请输入文档内容'],
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    description:{
        type:String,
        trim:true,
        default:''
    },
    tags:[{
        type:String,
        trim:true,
    }],
    status:{
        type:String,
        enum:['draft','published','archived'],
        default:'draft'
    },
    wordCount:{
        type:Number,
        default:0
    },
    annotationCount:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
});

documentSchema.pre('save',function(next){
    this,this.wordCount = this.content.length;
    this.updatedAt = Date.now();
    next();
});

const Document = mongoose.model('Document',documentSchema);

module.exports = Document;

