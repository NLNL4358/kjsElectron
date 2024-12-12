/*** variable */
/**
 * @param isLogin : 로그인 상태
 * @param userInfo : 로그인 한 유저의 정보
 * @param mode : 사용자의 모드를 설정합니다. false : 시청자 / true : 스트리머
 */
let isLogin = false;
let userInfo = {};
let mode = false;

/*** DOM */

/*** Function */
const initializeState = () => {
    getUserInfo();
};

const getUserInfo = () => {
    return new Promise((resolve) => {
        chrome.storage.local.get(['isLogin', 'userInfo', 'mode'], (result) => {
            isLogin = result.isLogin ?? false;
            userInfo = result.userInfo ?? {};
            mode = result.mode ?? false;
            console.log('Loaded state:', { isLogin, userInfo, mode });
        });
    });
};

const saveUserInfo = () => {
    chrome.storage.local.set({ isLogin, userInfo, mode }, () => {
        console.log('State saved:', { isLogin, userInfo, mode });
    });
};

/*** Event */

/*** Init */
initializeState();
