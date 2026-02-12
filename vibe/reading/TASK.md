# 任务
界面：简约风格
可以导入txt、epub，读取文本，也可以直接输入文本
选择模式，点击开始，开始阅读，隐藏其他控件
模式1：逐词显示：将一个一个词（通过`window.Intl`分词）增加在文本显示，形式上类似于GPT的打字机式的输出
模式2：RSVP(Rapid Serial Visual Presentation)，注意标红字要固定在一处，不能动
可设置背景和文本颜色，可随时调节速度和进度

## What is RSVP?
Rapid Serial Visual Presentation (RSVP) is a technique where text is displayed one word at a time at a fixed focal point. This eliminates the need for eye movements (saccades) during reading, potentially allowing for significantly faster reading speeds.
The app uses Optimal Recognition Point (ORP) highlighting - the red letter in each word indicates the point where your eye naturally focuses for fastest word recognition. This is calculated based on word length:
- 1-3 letter words: 1st letter
- 4-5 letter words: 2nd letter
- 6-9 letter words: 3rd letter
- 10+ letter words: 4th letter