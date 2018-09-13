var fs = require("fs");
//判断当前根目录里有没有page文件夹
fs.exists('./page', function(ss) {
  if(ss) {
    console.log("目录文件存在，正在创建新的文件")
    createFourFiles()
  }else {
    fs.mkdirSync("./page");
    console.log("创建page文件夹成功, 继续执行上一次的指令可以完成创建页面文件")
  }
})

//创建文件的方法 分别创建 wxml  wxss json js
function createFourFiles() {

  process.argv.slice(2).forEach(function(val) {
    let path = './page/' + val
    console.log(path)
     fs.exists(path, function(ss) {
      if(ss) {
        console.log("文件已存在不要重复创建")
      }else {
        console.log("开始创建")
        fs.mkdirSync(path)
        fs.createWriteStream(path + '/index.json')
        fs.createWriteStream(path + '/index.wxml')
        fs.createWriteStream(path + '/index.scss')
        fs.createWriteStream(path + '/index.js')
        initFiles(path + '/index.json', "{}")
        initFiles(path + '/index.wxml', "<View></View>")
        initFiles(path + '/index.scss', "/**样式**/")
        initFiles(path + '/index.js', "Page({})")
        console.log("创建完毕")
        appendAppJson(val + '/index')
      }
    })
  })
  
}

let initFiles = function(filename, contents) {
                      fs.writeFile(filename, contents,  function(err) {
                         if (err) {
                             return console.error(err);
                         }
                         console.log("数据写入成功！");
                      });
}

let appendAppJson = function(pageString) {
  fs.readFile('./app.json', function(err, data) {
    if(err) {
      console.log(err)
    }

    let pageconfig = data.toString();
    pageconfig = JSON.parse(pageconfig);
    pageconfig.pages.push(pageString);
    let str = JSON.stringify(pageconfig)
    fs.writeFile('./app.json', str, function(err) {
      if(err) {
        console.log(err)
      }else {
        console.log("页面注册成功")
      }

    })
  })
}