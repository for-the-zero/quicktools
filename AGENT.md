# WebTooys AI开发说明

- 这是一个基于cdn的、无服务器、无构建在线工具网页合集，不允许使用npm
- 使用CDN导入一切所需外部资源，不能使用node，编写纯前端页面，cdn可使用https://cdn.jsdmirror.com
- 可创建多个文件（包括html、css、js文件）
- 代码逻辑结构清晰
- `}`末尾必须要有`;`
- 减少注释量，尽量不注释
- 引入内部资源使用相对路径（如`./filename.js`）
- 我将给出`TASK.md`文件，你需要按照这个文件的指令在那个文件所在目录完成任务，不需要读取和修改其他目录的文件，完成任务后不能删除`TASK.md`文件
- 添加`<link rel="preconnect" href="https://cdn.jsdmirror.com" crossorigin>`（根据情况）和`<script defer src="https://cloud.umami.is/script.js" data-website-id="8a96c320-b541-482f-acd4-6fc1b3ec22dc"></script>`（必须）