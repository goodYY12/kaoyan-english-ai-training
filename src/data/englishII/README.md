# 英语二数据录入说明

英语二数据与英语一分开保存，避免影响英语一题库。

## 阅读

将每篇文章加入 `readingData.json`：

```json
{
  "id": "2025-english2-text1",
  "year": 2025,
  "paper": "英语二",
  "paperType": "English II",
  "textNumber": "Text 1",
  "title": "",
  "passage": "完整文章",
  "readingTips": [],
  "questions": [
    {
      "id": "2025-english2-text1-q21",
      "questionNumber": 21,
      "questionText": "题干",
      "options": { "A": "", "B": "", "C": "", "D": "" },
      "answer": "A",
      "type": "细节题",
      "explanation": "题目解析",
      "commonMistake": "常见错因",
      "examinerThinking": {},
      "sentenceTraining": {}
    }
  ],
  "vocabulary": [],
  "vocabularyGroups": {}
}
```

## 其他模块

- 完形：`clozeData.json`
- 翻译：`translationItems.json`
- 写作：`writingTemplates.json`
- 阅读技巧和长难句：`studyGuides.json`
- 通用词汇：`vocabulary.json`

只录入可核对的原题、答案和解析；无法确认的字段填写空数组或空字符串，不要编造。
