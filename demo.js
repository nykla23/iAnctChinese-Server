const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function demo() {
    console.log("======= 古汉语文本标注系统演示 =======");

    try {
        console.log('1.创建测试用户...');
        const userResponse = await axios.post(`${API_BASE}/users`, {
            name: '测试用户',
            email: 'demo@example.com',
            role: '研究员'
        });
        const user = userResponse.data.data._id;
        console.log('用户创建成功:', userResponse.data.data.name,'\n');

        console.log('2.创建测试文档...');
        const docResponse = await axios.post(`${API_BASE}/documents`, {
            title: '论语节选',
            content: '子曰：学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？',
            description: '《论语》中的一段经典语录。',
            tags: ['论语', '经典', '儒家'],
            authorId: userId
        });

        const document = docResponse.data.data._id;
        console.log('文档创建成功:', docResponse.data.data.title,'\n');

        console.log('3.为文档自动添加标注...');
        const segmentationResponse = await axios.post(`${API_BASE}/segmentation/segment-document/${document}`, {
            authorId: userId
        });
        console.log('✅ 自动标注完成，生成标注数:', segmentationResponse.data.data.segments, '\n');

        console.log('4. 添加手动标注...');
        const annotationResponse = await axios.post(`${API_BASE}/annotations`, {
            documentId: documentId,
            authorId: userId,
            content: '子曰',
            startIndex: 0,
            endIndex: 2,
            type: 'phrase',
            partOfSpeech: '名词短语',
            semanticTag: '人物言语',
            explanation: '孔子说，古代圣贤的言论'
        });
        console.log('手动标注添加成功:', annotationResponse.data.data.content, '\n');

        console.log('5.获取文档及其标注...');
        const annotationsListResponse = await axios.get(`${API_BASE}/annotations/document/${documentId}`);
        console.log('📊 标注统计:');
        console.log('   - 总标注数:', annotationsResponse.data.count);
        annotationsResponse.data.data.forEach((ann, index) => {
        console.log(`   ${index + 1}. ${ann.content} (${ann.type}) - ${ann.partOfSpeech}`);
        });
        console.log('');

        console.log('🎉 项目演示完成！');
    console.log('📋 已实现功能:');
    console.log('   ✅ 用户管理系统');
    console.log('   ✅ 文档管理系统');
    console.log('   ✅ 自动分词标注');
    console.log('   ✅ 手动标注功能');
    console.log('   ✅ 批量标注处理');
    console.log('   ✅ 数据关联查询');
    console.log('');
    console.log('🌐 前端可访问以下API进行开发:');
    console.log('   - 用户API: /api/users');
    console.log('   - 文档API: /api/documents');
    console.log('   - 标注API: /api/annotations');
    console.log('   - 分词API: /api/segmentation');

  } catch (error) {
        if (error.response) {
            console.error('❌ API请求失败:', error.response.data);
        } else {
            console.error('❌ 请求错误:', error.message);
        }
    }
    console.log("=================================");
}

demo();



