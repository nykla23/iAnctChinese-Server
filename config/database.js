const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/ianctchinese', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB 已连接: ${conn.connection.host}`);
        console.log(`数据库名称: ${conn.connection.name}`);
    } catch (error) {
        console.error(`MongoDB 连接错误: ${error.message}`);
        process.exit(1);
    }   
};

module.exports = connectDB;
