const {app, BrowserWindow, Menu} = require("electron");

/*** 변수 */
let window ; /* 윈도우는 전역변수로 만들어 menu에서 접근 가능하도록 설정 */

    // custom 메뉴 만들기
const NLMenu = [
    {
        label : "myMenu",
        submenu : [
            {
                role : "about",
            },
            {
                type : "separator",
            },
            {
                role : "quit",
            },
        ],
    },
    {
        label : "eat 🍕",
        submenu : [
            {
                label : "Hello",
                click : () => {
                    window.webContents.executeJavaScript(`
                        testFunction();
                    `);
                }
            },
            {
                type : "separator",
            },
            {
                label : "Reset Preferences",
                click : () => {
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
        width : 900,
        height : 600,
    })
    window.loadFile("index.html");
}

/*** init */
app.whenReady().then(() => {
    createWindow();
    
    const customMenu = Menu.buildFromTemplate(NLMenu);
    Menu.setApplicationMenu(customMenu);
})