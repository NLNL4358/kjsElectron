const { app, BrowserWindow, Menu } = require("electron");
const path = require('path')

/*** 변수 */
let window; /* 윈도우는 전역변수로 만들어 menu에서 접근 가능하도록 설정 */

// custom 메뉴 만들기
const NLMenu = [
    {
        label: "myMenu",
        submenu: [
            {
                role: "about",
            },
            {
                type: "separator",
            },
            {
                role: "quit",
            },
        ],
    },
    {
        label: "eat 🍕",
        submenu: [
            {
                label: "Hello",
                click: () => {
                    window.webContents.executeJavaScript(`
                        testFunction();
                    `);
                }
            },
            {
                type: "separator",
            },
            {
                label: "Reset Preferences",
                click: () => {
                    window.webContents.executeJavaScript(`
                        localStorage.clear();
                        window.location.reload();
                    `);
                }
            }
        ],
    },
];

/*** Function */
const createWindow = () => {
    window = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true
    })
    window.loadURL("http://localhost:3000")
}

/*** init */
app.whenReady().then(() => {
    createWindow();
    // const customMenu = Menu.buildFromTemplate(NLMenu);
    // Menu.setApplicationMenu(customMenu);
})
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})