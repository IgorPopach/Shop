import { AsyncStorage } from 'react-native';

import { API_KEY } from '../../constants/firebase';

export const STORE_USER = 'STORE_USER';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AL = 'SET_DID_TRY_AL';

let timer;

export const setDidTryAL = () => ({
    type: SET_DID_TRY_AL
});

export const storeUser = (data, expiryTime) => dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({
        type: STORE_USER,
        payload: data
    });
};

export const signup = (email, password) => async dispatch => {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true
            })
        });

    if (!response.ok) {
        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_EXISTS') {
                message = 'The email address is already in use by another account!'
            }
            throw new Error(message)
        };
    };

    const resData = await response.json();
    const expiryTime = parseInt(resData.expiresIn) * 1000;
    dispatch(storeUser(
        {
            token: resData.idToken,
            userId: resData.localId
        },
        expiryTime
    ));
    const expirationDate = new Date(new Date().getTime() + expiryTime).toISOString();
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
};

export const login = (email, password) => async dispatch => {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true
            })
        });

    if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = 'Something went wrong!';
        if (errorId === 'EMAIL_NOT_FOUND') {
            message = 'This email could not be found!'
        } else if ('INVALID_PASSWORD') {
            message = 'This password is not valid!'
        }
        throw new Error(message)
    };
    const resData = await response.json();
    const expiryTime = parseInt(resData.expiresIn) * 1000;
    dispatch(storeUser(
        {
            token: resData.idToken,
            userId: resData.localId
        },
        expiryTime
    ));
    const expirationDate = new Date(new Date().getTime() + expiryTime).toISOString();
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
};

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return {
        type: LOGOUT
    }
};

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer)
    }
};

const setLogoutTimer = expirationTime => dispatch => {
    timer = setTimeout(() => {
        dispatch(logout());
    }, expirationTime)
};

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token,
        userId,
        expirationDate
    }))
};