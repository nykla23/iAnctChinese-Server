const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'请输入用户名'],
        trim:true,
    }   ,
    email:{
        type:String,
        required:[true,'请输入邮箱'],
        default:'标注员',
        unique:true,
        trim:true,
        lowercase:true
    },
    role:{
        type:String,
        enum:['管理员','研究员','标注员','访客'],
        default:'标注员'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const User = mongoose.model('User',userSchema);
module.exports = User;
// module.exports = mongoose.model('User',userSchema);