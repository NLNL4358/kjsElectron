/*** import */
const { app, BrowserWindow, Menu } = require('electron');

/*** variable */
let window;

/*** Dom */

/*** function */
const createWindow = () => {
    const window = new BrowserWindow({
        width: 500,
        height: 700,
    });
    window.loadFile('index.html');
};

/*** Event */

/*** Init */
app.whenReady().then(() => {
    createWindow();
});
