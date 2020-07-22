import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { ADD_NEW_ORDER } from '../actions/orders';
import { DELETE_PRODUCT } from '../actions/products';

import CartItem from '../../models/cart-item';

const initialState = {
    items: {},
    totalAmount: 0
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case ADD_TO_CART:
            const { id, price, title, pushToken } = payload;
            let updatedOrNewCartItem;
            if (state.items[id]) {
                updatedOrNewCartItem = new CartItem(
                    state.items[id].quantity + 1,
                    price,
                    title,
                    pushToken,
                    state.items[id].sum + price
                )
            } else {
                updatedOrNewCartItem = new CartItem(1, price, title, pushToken, price);
            }
            return {
                ...state,
                items: { ...state.items, [id]: updatedOrNewCartItem },
                totalAmount: state.totalAmount + price
            }
        case REMOVE_FROM_CART:
            const filteredItems = { ...state.items };
            const productItem = filteredItems[payload];
            if (productItem.quantity === 1) {
                delete filteredItems[payload];
            } else {
                const updatedCartItem = new CartItem(
                    productItem.quantity - 1,
                    productItem.productPrice,
                    productItem.productTitle,
                    productItem.pushToken,
                    productItem.sum - productItem.productPrice
                );
                filteredItems[payload] = updatedCartItem;
            }
            return {
                ...state,
                items: filteredItems,
                totalAmount: state.totalAmount - productItem.productPrice
            }
        case ADD_NEW_ORDER:
            return initialState;
        case DELETE_PRODUCT:
            if (!state.items[payload]) {
                return state
            };
            const updatedCartItems = { ...state.items };
            const itemSum = updatedCartItems[payload].sum;
            delete updatedCartItems[payload];
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - itemSum
            }
        default:
            return state;
    }
};