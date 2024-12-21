const { app, BrowserWindow, Menu, ipcMain, screen } = require('electron');
const express = require('express'); // express 를 사용하니까 require하여 가져온다
const path = require('path');

/*** 변수 */
let window; /* 윈도우는 전역변수로 만들어 menu에서 접근 가능하도록 설정 */
let pipToggle = false; /* 핍모드 toggle */

/*** 상수  */
const pipWindowSize = {
    width: 370,
    height: 290,
};
const localPort = 54321;

// custom 메뉴 만들기
const NLMenu = [
    {
        label: 'about',
        submenu: [
            {
                role: 'about',
            },
            {
                type: 'separator',
            },
            {
                role: 'quit',
            },
        ],
    },
    {
        label: 'mode',
        submenu: [
            {
                label: 'Pip Mode',
                accelerator: 'Ctrl+Shift+P',
                click: () => {
                    modeChanger();
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Developer', // 개발자모드
                accelerator: 'Ctrl+Shift+I', // 단축키 설정
                click: () => {
                    window.webContents.toggleDevTools(); // 개발자 도구 열기/닫기
                },
            },
        ],
    },
];

/*** Function */
const startServer = () => {
    const server = express();

    // React 빌드된 파일의 경로 지정
    server.use(express.static(path.join(__dirname, '../build')));

    // 기본 경로로 들어왔을 때 React의 index.html 반환
    server.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../build/index.html'));
    });

    // 서버 시작
    server.listen(localPort, () => {
        console.log(`React build served at http://localhost:${localPort}`);
    });
};

const createWindow = () => {
    window = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // preload.js 파일 경로
            nodeIntegration: false, // IPC 사용위해서는 false
            contextIsolation: true, // IPC 사용하기위해서 true 필요
        },
        autoHideMenuBar: true,
    });
    const startURL = `http://localhost:${localPort}`;
    window.loadURL(startURL);
};

const modeChanger = () => {
    pipToggle = !pipToggle;
    switch (pipToggle) {
        case true:
            changePipMode();
            break;
        case false:
            changeAppMode();
            break;
        default:
            changeAppMode();
            break;
    }
};
/**
 * @description - 일반 모드로 변경함수
 */
const changeAppMode = () => {
    /* min사이즈 제한 변경 */
    window.setMinimumSize(720, 540);

    /* 윈도우 비율 고정 해제  */
    window.setAspectRatio(0);

    /* 화면 정보 가져오기 (PIP 모드였던 모니터 기준) */
    const currentBounds = window.getBounds();
    const primaryDisplay = screen.getDisplayNearestPoint({
        x: currentBounds.x,
        y: currentBounds.y,
    });

    /* 해당 모니터의 중앙 좌표 계산 */
    const { width, height, x, y } = primaryDisplay.workArea;
    const centerX = x + (width - 1024) / 2;
    const centerY = y + (height - 768) / 2;

    /* 윈도우 위치를 중앙으로 설정 */
    window.setBounds({
        x: Math.round(centerX),
        y: Math.round(centerY),
        width: 1024,
        height: 768,
    });

    window.setAlwaysOnTop(false, 'normal', 0);
};
/**
 * @description - Pip 모드로 변경함수
 */
const changePipMode = () => {
    /* min사이즈 제한 변경 */
    window.setMinimumSize(pipWindowSize.width, pipWindowSize.height);

    /* 윈도우 center 해제 */
    window.center(false);

    /* 윈도우 비율 고정  */
    window.setAspectRatio(pipWindowSize.width / pipWindowSize.height);

    /* 화면 정보 가져오기 (현재 윈도우가 있는 모니터 기준) */
    const currentBounds = window.getBounds();
    const currentDisplay = screen.getDisplayNearestPoint({
        x: currentBounds.x,
        y: currentBounds.y,
    });

    /* 해당 모니터의 작업 영역 크기를 가져와서 오른쪽 하단 좌표 계산 */
    const { width, height, x, y } = currentDisplay.workArea;
    const pipX = x + width - pipWindowSize.width * 1.1; // 오른쪽 끝에서 10% 여백
    const pipY = y + height - pipWindowSize.height * 1.1; // 아래쪽 끝에서 10% 여백

    window.setBounds({
        x: Math.round(pipX),
        y: Math.round(pipY),
        width: pipWindowSize.width,
        height: pipWindowSize.height,
    });

    /* 윈도우를 항상 위에 표시 */
    window.setAlwaysOnTop(true, 'floating', 1);
};

/*** init */
app.whenReady().then(() => {
    if (app.isPackaged) {
        startServer(); // 배포 시 Express 서버 시작
    }
    createWindow();
    const customMenu = Menu.buildFromTemplate(NLMenu);
    Menu.setApplicationMenu(customMenu);
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

/*** IPC - Event - handler  " React와 Electron의 소통 "*/
ipcMain.on('change-pip-mode', () => {
    modeChanger();
});
