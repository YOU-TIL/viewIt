const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const {autoUpdater} = require("electron-updater");

let win;

ipcMain.on('restart', () => {
    if (win) {
        win.loadURL('');
        setTimeout(() => {
            win.loadURL(getFramePath());
        }, 500);
    }
});

function getFramePath(resName) {
    let locale = app.getLocale();
    let supportedLanguage = ['ko'];
    if (!supportedLanguage.includes(locale)) locale = 'ko';
    return `file://${__dirname}/frame.html?locale=${locale}&resName=${resName}.html`;
}

function createWindow() {
    win = new BrowserWindow({
        width: 900, height: 600, webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            enableRemoteModule: true
        }, icon: path.join(__dirname, 'logo.ico'), frame: false
    });
    win.setMenu(null);
    win.loadURL(getFramePath());

    //win.webContents.openDevTools({mode: "detach"});

    setTimeout(() => {
        autoUpdater.checkForUpdates();
    }, 1000)

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', () => {
    createWindow();
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

function sendToast(msg) {
    win.webContents.send('showToast', msg);
}

autoUpdater.on('update-available', (info) => {
    sendToast('업데이트를 다운받는 중...');
});
autoUpdater.on('error', (err) => {
    sendToast('업데이트 중 오류가 발생했습니다.');
});
autoUpdater.on('update-downloaded', (info) => {
    sendToast('다음 시작시 업데이트가 적용됩니다.');
});