const {app, BrowserWindow} = require("electron");

/*** 변수 */
let window ; /* 윈도우는 전역변수로 만들어 menu에서 접근 가능하도록 설정 */

const createWindow = () => {
    window = new BrowserWindow({
        width : 900,
        height : 600,
    })
    window.loadFile("index.html");
}

app.whenReady().then(() => {
    createWindow();
})