import { STORE_USER, LOGOUT } from '../actions/auth';

const initialState = {
    token: null,
    userId: null
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case STORE_USER:
            const { token, userId } = payload;
            return {
                token,
                userId
            }
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
};