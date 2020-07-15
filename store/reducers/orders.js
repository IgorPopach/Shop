import { ADD_NEW_ORDER, SET_ORDERS } from '../actions/orders';
import Order from '../../models/order';

const initialState = {
    orders: []
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_ORDERS:
            return {
                orders: payload
            }
        case ADD_NEW_ORDER:
            const { id, order, amount, date } = payload;
            const newOrder = new Order(id, order, amount, date);
            return {
                ...state,
                orders: state.orders.concat(newOrder)
            };
        default:
            return state;
    };
};