const electron = require('electron')
const { app, BrowserWindow,ipcMain } = require('electron')
const path = require('path')
const url = require('url')

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
