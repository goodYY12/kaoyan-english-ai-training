# 真题数据进展

## 线上域名

- Vercel 默认地址：`https://kaoyan-english-ai-training.vercel.app/`
- 自定义主域名：`https://kaoyanyingyi.online/`
- 自定义 www 域名：`https://www.kaoyanyingyi.online/`

## 已接入模块

- 阅读训练：2007-2026 年，Text 1-4，共 80 篇。
- 完形专项：2007-2026 年，共 20 篇入口。
- 翻译训练：2007-2026 年入口。
- 写作训练：2007-2026 年入口。

## 本次补充

- 同步 README 中的两个自定义域名。
- 校验了阅读和完形答案字段：当前 A/B/C/D 答案字段已完整。
- 识别出翻译参考译文缺口，等待继续核对可靠来源后再写入。

## 当前主要缺口

- 2020、2017-2007 年翻译参考译文仍需补全。
- 部分年份写作范文、可用表达和扣分点需要继续校对。
- 部分阅读题的干扰项分析、常见错因、出题人思维字段仍需继续细化。

## 数据维护位置

- 阅读：`src/data/papers/年份/text1.json` 到 `text4.json`
- 完形：`src/data/cloze/clozeData.json`
- 翻译：`src/data/translationItems.json`
- 写作：`src/data/writingTemplates.json`

## 录入规则

- 只录入可核对的真题、答案和解析。
- 无法确认的字段写“待补充”，不要编造。
- 每次补数据后运行测试和构建。
