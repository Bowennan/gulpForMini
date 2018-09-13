# 基于gulp的小程序工作流
this construction is serviced for MinPor based on gulp
## 使用方法：
1. clone 到本地

2. 安装依赖  npm install  或者  yarn (yarn 比较稳定不需要翻墙)

3. 初始化第一个页面 index  执行：
   __npm run create index__  (注意：第一次安装会自动创建page文件夹，会有提示，再执行一次此命令会真正创建index页面相关的文件)
  __本工作流所创建的文件是按照小程序的规范创建的，只不过引入了scss, 进行了代码压缩以及图片压缩, 新建页面后会自动添加到全局的app.json中__
  之后需要添加新的页面直接执行 __npm run create serach__ （这次创建了serach页面 wxml  scss js json）
  
4. 小程序的组件书写同官网 在components文件夹下创建你的组件，不要包裹任何层级文件夹, 写法见小程序官网 [小程序api](https://developers.weixin.qq.com/miniprogram/dev/api/)

5. 创建基本的页面后，启动项目  __gulp dev__ ，将会开启一个具有实时监听的服务器，并在根目录下生成 dist文件， 你只需要打开 微信开发者工具，将项目目录选择为dist,并填写你的 appId 和 程序标题

6. 这个时候你就可以随意选择一个编辑器，开始编辑，凡是page里的文件都将获得监听，组件也一样，但是全局的配置文件 比如： app.js app.json app.scss, 包括外层文件 比如： 数据请求 urlconfig，这些之所以不进行监听：要求你在项目开始时就进行正确的配置， 中间如修改， 请重新启动项目

7. __本工作流很好的区分了测试环境和正式开发环境__  dev(测试环境)   pro（正式环境）  
   __urlconfig__ 文件中有两个文件分别是 __dev_url.js__ 和 __pro_url.js__ 前者放置测试的用地址  后者放置正式发布地址, 使用时把他当做外部js文件，使用import 导入到 页面文件的js中即可， 你不用担心打包，gulp dev 只会命中 dev环境的地址  而 __gulp__ 将会命中pro环境中的地址  (温馨提示： 在你小程序的管理端（官网）配置好地址，不然也是徒劳哦)
   
8. 打包发布： 执行 __gulp__ 即可, 此命令不在监听任何文件变动，单纯的打包代码压缩图片压缩 dist 为最终输出文件
   
8. 有问题欢迎反馈和探讨 来自**Bowennan**  druidking@126.com
