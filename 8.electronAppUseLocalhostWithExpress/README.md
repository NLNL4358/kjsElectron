# express를 이용하여 메인 프로세스에서 서버를 구성하기

7까지 수행하게되면 Electron앱은 npm run start으로 실행하고 window.location.href 하게되면 localhost에서 실행되고 있음을 볼 수있고
npm run make 하여 생성된 앱은 window.location.href 하게되면 해당 설치된 앱의 index.html 이 있는 파일 ex) file:///D:/.../out/프로젝트명win32-x64/resources/app/build/index.html
에서 실행됨을 볼 수 있다.

이번에는 npm run make로 생성된 앱도 localhost 에서 실행되도록 즉, react 빌드파일을 localhost에 서빙하는 방법을 학습한다.

## 1. express 설치

    React의 빌드 파일을 서빙하기위해 'express' 라는 패키지를 설치하기위해 프로젝트 루트에서 다음 명령어를 실행한다.
    " npm install express "

## 2. main.js 에서 express 서버 구성

    main.js에서 다음의 코드를 추가한다.
    a) const express = require('express');  // express 를 사용하니까 require하여 가져온다

    b) 선언하고싶은 특정 port에서 서버를 여는 시퀀스 추가
    const startServer = () => {
        const server = express();
        const port = 54321;     // 원하는 포트번호

        // React 빌드된 파일의 경로 지정
        server.use(express.static(path.join(__dirname, '../build')));

        // 기본 경로로 들어왔을 때 React의 index.html 반환
        server.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../build/index.html'));
        });

        // 서버 시작
        server.listen(port, () => {
            console.log(`React build served at http://localhost:${port}`);
        });
    };

    c) createWindow() 함수를 다음과 같이 수정한다.
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
        // 개발 모드: React 개발 서버로 연결
        // 배포 모드: Express 서버의 localhost로 연결
        const startURL = app.isPackaged
            ? 'http://localhost:54321' // 배포 모드에서 Express 서버 URL
            : 'http://localhost:54321'; // 개발 모드에서 React 개발 서버 URL 변경을 위한다면 바꿈

        mainWindow.loadURL(`startURL`);
    };

    d) App이 맨처음 초기화 될때 즉, createWindow() 를 수행하기 전 app의 패키지상태를 확인하여
        위의 startServer를 수행한다.
    app.whenReady().then(() => {
        if (app.isPackaged) {
            startServer(); // 배포 시 Express 서버 시작
        }
        createWindow();
        ...
    });


    e) package.json 에서 electron 실행 시 wait-on 하는 port를 해당 포트로 바꿔준다
    {
        "name": "8.electronAppUseLocalhostWithExpress",
        "version": "0.1.0",
        "private": true,
        "dependencies": {
            "cra-template": "1.2.0",
            "electron-squirrel-startup": "^1.0.1",
            "express": "^4.21.2",
            "react": "^19.0.0",
            "react-dom": "^19.0.0",
            "react-scripts": "5.0.1"
        },
        "productName": "8.electronAppUseLocalhostWithExpress",
        "author": "NLNL4358",
        "main": "src/main.js",
        "description": " Build된 앱이 특정 port의 localhost에서 구동시키기 ",
        "homepage": "./",
        "scripts": {
            "start": "concurrently \"npm run react:start\" \"npm run electron\" ",
            "react:start": "react-scripts start",
            "clean": "rimraf build",
            "build": "npm run clean && react-scripts build",
            "test": "react-scripts test",
            "eject": "react-scripts eject",
            "electron": "wait-on http://127.0.0.1:54321 && electron-forge start",
            "package": "electron-forge package",
            "make": "npm run build && electron-forge make"
        },
        ...
    }

    f) 이제 npm run make 하게되어 생성된 프로그램에서 window.location.href 하게되면
    위에서 설정한 포트번호를 가진 http://localhost:포트번호/ 를 보이게된다.
