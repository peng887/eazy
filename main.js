const { electron, app, BrowserWindow,ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const https = require('https')
const stream = require('stream')
const versionUrl = 'https://raw.githubusercontent.com/peng887/eazy/master/package.json'

//创建窗口
let onlineStatusWindow
const createWindow = () => {
  onlineStatusWindow = new BrowserWindow({
    width: 1280,
    height:740
  })
  onlineStatusWindow.loadFile(path.join(__dirname,'/static/classroom_html/cover.html'))
  onlineStatusWindow.webContents.openDevTools()
  onlineStatusWindow.on('closed', () => {
    onlineStatusWindow = null
  })
}
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')
app.on('ready',createWindow)

//检查更新
// ipcMain.on('asynchronous-message', (event, arg) => {
//   if (arg) {
//     https.get(versionUrl,(res) => {
//       if (res.statusCode == 200) {
//         res.on("data",(data) => {
//           let versionOnline = JSON.parse(data.toString()).version
//           fs.readFile('./package.json',(err,res) => {
//             let versionOutline = JSON.parse(res.toString()).version
//             if (versionOnline != versionOutline) {
//               event.sender.send('asynchronous-reply', true)
//             } else {
//               event.sender.send('asynchronous-reply', false)
//             }
//           })
//         }).on('error', (e) => {
//           console.error(`请求遇到问题: ${e.message}`)
//         })
//       } else {
//         console.info(res.statusCode)
//       }
//     })
//   }
// })

//确认更新
// ipcMain.on('asynchronous-ok', (event, arg) => {
//   if (arg) {
//     https.get(versionUrl, (res) => {
//       event.sender.send('asynchronous-re', true)
//       if (res.statusCode == 200) {
//         res.on("data", (data) => {
//           let versionOnline = JSON.parse(data.toString()).version
//           let updateInfo = JSON.parse(data.toString()).updateInfo
//           updateInfo.map((item, i) => {
//             if (item.version == versionOnline) {
//               item.files.map((file, i) => {
//                 https.get("https://raw.githubusercontent.com/peng887/eazy/master/static/classroom_html/"+file,(res) => {
//                   res.on("data", (data) => {
//                     console.info(data.toString())
//                     let rs = fs.createReadStream(data)
//                     rs.close()
//                     let ws = fs.createWriteStream('./test.html')
//                     rs.pipe(ws)
//                   })
//                 })
//               })
//             }
//           })
//         }).on('error', (e) => {
//           console.error(`请求遇到问题: ${e.message}`)
//         })
//       }
//     })
//   }
// })
network()

//macOS窗口处理
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}).on('activate', () => {
  if (onlineStatusWindow === null) {
    createWindow()
  }
})

//检查网络
function network () {
  let isOnline = true
  let isOutline = false
  ipcMain.on('online-status-changed', (event, status) => {
    if (status && isOnline) {
      isOnline = false
      isOutline = false
      setTimeout(() => {
        onlineStatusWindow.loadFile(path.join(__dirname,'/static/classroom_html/index.html'))
      },2000)
    } else if (!status && !isOutline) {
      setTimeout(() => {
        onlineStatusWindow.loadFile(path.join(__dirname,'/static/classroom_html/netError.html'))
        isOnline = true
        isOutline = true
      },2000)
    }
  })
}
/*
  * Author:peng
*/
