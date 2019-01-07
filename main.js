const electron = require('electron')
const { app, BrowserWindow,ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const https = require('https')
const versionUrl = 'https://raw.githubusercontent.com/peng887/eazy/master/package.json'

let onlineStatusWindow
const createWindow = () => {
  onlineStatusWindow = new BrowserWindow({
    width: 1280,
    height:740
  })
  onlineStatusWindow.loadFile(path.join(__dirname,'/static/classroom_html/cover.html'))
  // onlineStatusWindow.webContents.openDevTools()
  onlineStatusWindow.on('closed', () => {
    onlineStatusWindow = null
  })
}
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')
app.on('ready',createWindow)

https.get(versionUrl,(res) => {
  res.on("data",(data) => {
    let versionOnline = JSON.parse(data.toString()).version
    fs.readFile('./package.json',(err,res) => {
      let versionOutline = JSON.parse(res.toString()).version
      if (versionOnline != versionOutline) {
        console.info("有更新")
      } else {
        console.info("没有更新，请使用")
      }
    })
  })
})

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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (onlineStatusWindow === null) {
    createWindow()
  }
})
