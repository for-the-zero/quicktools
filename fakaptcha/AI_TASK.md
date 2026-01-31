# 要求

- 代码逻辑结构清晰，可以创建css和js文件
- `}`末尾必须要有`;`
- 减少注释量，尽量不注释
- 不要删除这个文件
- 使用CDN导入一切所需外部资源，不能使用node，编写纯前端页面
- 引入内部资源使用相对路径

# 任务

制作一个模仿Cloudflare验证页面（cloudflare-turnstile-challenge）的页面，要1:1还原

- 界面要1:1还原Cloudflare Turnstile Challenge，要一模一样
- UI使用英文，界面上所有的文本都是
- 网页图标是一个地球svg（chrome的）
- 域名要用js获取，不写死
- Ray ID随机生成
- 验证码右边的图标个两个链接可以不要
- 页脚有个小字提示：这不是真的验证码，只是一个玩笑
- 图标资源使用svg

- 不进行真正的验证，而是点击验证码之后转到加载动画
- 进入加载动画后等待30~100秒（随机），75%概率提示出错并在3秒后刷新网页，25%概率提示成功并跳转到下面任意一个链接：
- - https://virt.moe/cferr/lutshz5
- - https://virt.moe/cferr/y4ccst1
- - https://virt.moe/cferr/s92rc5d
- - https://virt.moe/cferr/uktdr2n
- - https://virt.moe/cferr/s9vprul

- 作弊代码：↑↑↓↓←→←→BA
- 直接提示成功并跳转到链接