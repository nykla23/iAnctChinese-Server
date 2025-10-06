// utils/segmenter.js - 实用版分词器
class PracticalSegmenter {
  segment(text) {
    const segments = [];
    
    // 简单实用的分词规则
    let start = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      // 遇到标点或虚词就分词
      if (this.isBreakPoint(char) && i > start) {
        const content = text.substring(start, i);
        if (content.trim()) {
          segments.push(this.createSegment(content, start, i - 1));
        }
        start = i;
      }
      
      // 标点符号单独分词
      if (this.isPunctuation(char)) {
        if (i > start) {
          const content = text.substring(start, i);
          if (content.trim()) {
            segments.push(this.createSegment(content, start, i - 1));
          }
        }
        segments.push(this.createSegment(char, i, i, 'punctuation'));
        start = i + 1;
      }
    }
    
    // 处理最后一段
    if (start < text.length) {
      const content = text.substring(start);
      if (content.trim()) {
        segments.push(this.createSegment(content, start, text.length - 1));
      }
    }
    
    return segments;
  }

  isBreakPoint(char) {
    const breakWords = ['之', '乎', '者', '也', '矣', '而', '以', '于', '与'];
    return breakWords.includes(char);
  }

  isPunctuation(char) {
    return ['，', '。', '；', '：', '！', '？', '、'].includes(char);
  }

  createSegment(content, start, end, type = null) {
    const actualType = type || this.determineType(content);
    return {
      content: content,
      startIndex: start,
      endIndex: end,
      type: actualType,
      partOfSpeech: this.suggestPartOfSpeech(content, actualType),
      semanticTag: this.suggestSemanticTag(content),
      confidence: 0.8
    };
  }

  determineType(content) {
    if (content.length === 1) return 'word';
    if (content.length <= 4) return 'phrase';
    return 'sentence';
  }

  suggestPartOfSpeech(content, type) {
    if (type === 'punctuation') return '标点符号';
    
    const nouns = ['子', '曰', '朋', '友', '人', '君', '道', '德', '仁', '义'];
    const verbs = ['学', '习', '来', '知', '乐', '说', '愠'];
    
    if (nouns.some(noun => content.includes(noun))) return '名词';
    if (verbs.some(verb => content.includes(verb))) return '动词';
    
    return '其他';
  }

  suggestSemanticTag(content) {
    const learning = ['学', '习', '知'];
    const social = ['朋', '友', '人', '君'];
    const emotion = ['乐', '说', '愠'];
    
    if (learning.some(word => content.includes(word))) return '学习认知';
    if (social.some(word => content.includes(word))) return '社会关系';
    if (emotion.some(word => content.includes(word))) return '情感表达';
    
    return '一般概念';
  }
}

// 确保正确导出
module.exports = PracticalSegmenter;
