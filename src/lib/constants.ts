/**
 * 共通定数
 */
export const COMMON_CONSTANTS = {
    URL: {
        API_AUTH_SESSION: '/api/auth/session',
        PAGE_LOGIN_FORM: '/auth/form',
        API_DIFY: '/api/dify',
    },
    PATH: {
        AVATAR_MODEL_PATH: process.env.NEXT_PUBLIC_AVATAR_MODEL_PATH,
    },
    MESSAGE: {
        LOGIN_REQUIRED: 'ログインしてください。',
        SIGNOUT_SUCCESSED: 'SignOut Successed',
    },
    HEADER: {
        TITLE: 'AI Chat Assistant',
    },
    FOOTER: {
        COPYRIGHT: 'AI Chat Assistant. All rights reserved.',
    },
};
