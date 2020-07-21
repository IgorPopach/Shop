import { STORE_USER, LOGOUT, SET_DID_TRY_AL } from '../actions/auth';

const initialState = {
    token: null,
    userId: null,
    didTryAutoLogin: false
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case STORE_USER:
            const { token, userId } = payload;
            return {
                token,
                userId,
                didTryAutoLogin: true
            }
        case SET_DID_TRY_AL:
            return {
                ...state,
                didTryAutoLogin: true
            }
        case LOGOUT:
            return {
                ...initialState,
                didTryAutoLogin: true
            };
        default:
            return state;
    }
};