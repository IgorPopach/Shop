import { DELETE_PRODUCT, EDIT_PRODUCT, ADD_PRODUCT, SET_PRODUCTS } from '../actions/products';
import Product from '../../models/product';

const initialState = {
    availableProducts: [],
    userProducts: []
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_PRODUCTS:
            const { availableProducts, userProducts } = payload;
            return {
                availableProducts,
                userProducts
            }
        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts: state.userProducts.filter(product => product.id !== payload)
            };
        case ADD_PRODUCT:
            const { id, title, price, description, imageUrl, ownerId } = payload;
            const newProduct = new Product(
                id,
                ownerId,
                title,
                imageUrl,
                description,
                price
            );
            return {
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct)
            }
        case EDIT_PRODUCT:
            const editProducts = (products) => products.map(product => {
                if (product.id === payload.id) {
                    return {
                        ...product,
                        ...payload
                    }
                };
                return product;
            });
            return {
                ...state,
                availableProducts: editProducts(state.availableProducts),
                userProducts: editProducts(state.userProducts),

            }
        default:
            return state;
    }
};