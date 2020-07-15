import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const EDIT_PRODUCT = 'EDIT_PRODUCT';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => async (dispatch, getState) => {
    try {
        const userId = getState().auth.userId;
        const response = await fetch('https://rn-complete-guide-b962a.firebaseio.com/products.json');
        if (!response.ok) {
            throw new Error('Something went wrong!')
        }

        const resData = await response.json();
        const loadedData = resData && Object.keys(resData).map(key => {
            return new Product(
                key,
                resData[key].ownerId,
                resData[key].title,
                resData[key].imageUrl,
                resData[key].description,
                resData[key].price
            )
        });
        const userProducts = loadedData.filter(product => product.ownerId === userId);
        dispatch({
            type: SET_PRODUCTS,
            payload: {
                availableProducts: loadedData,
                userProducts
            }
        })
    } catch (error) {
        throw error;
    }
}

export const deleteProduct = (id) => async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`https://rn-complete-guide-b962a.firebaseio.com/products/${id}.json?auth=${token}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Something went wrong!')
    }
    dispatch({
        type: DELETE_PRODUCT,
        payload: id
    })
};

export const editProduct = product => async (dispatch, getState) => {
    try {
        const token = getState().auth.token;
        const response = await fetch(
            `https://rn-complete-guide-b962a.firebaseio.com/products/${product.id}.json?auth=${token}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...product })
            });
        if (!response.ok) {
            throw new Error(`Updating false...`)
        }
        dispatch({
            type: EDIT_PRODUCT,
            payload: product
        })
    } catch (error) {
        throw error
    }
};

export const createProduct = product => async (dispatch, getState) => {
    const { token, userId } = getState().auth;
    const response = await fetch(`https://rn-complete-guide-b962a.firebaseio.com/products.json?auth=${token}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...product, ownerId: userId })
        });
    const resData = await response.json();

    dispatch({
        type: ADD_PRODUCT,
        payload: { ...product, id: resData.name, ownerId: userId }
    })
};