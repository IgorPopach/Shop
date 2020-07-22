import Order from '../../models/order';

export const ADD_NEW_ORDER = 'ADD_NEW_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const addNewOrder = (order, amount) => async (dispatch, getState) => {
    const date = new Date();
    const { token, userId } = getState().auth;
    const response = await fetch(`https://rn-complete-guide-b962a.firebaseio.com/orders/${userId}.json?auth=${token}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ order, amount, date: date.toISOString() })
        });
    if (!response.ok) {
        throw new Error('Something went wrong!')
    }
    const resData = await response.json();
    dispatch({
        type: ADD_NEW_ORDER,
        payload: { order, amount, id: resData.name, date }
    });

    for (const cartItem of order) {
        const pushToken = cartItem.pushToken;

        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: pushToken,
                title: 'Order was placed!',
                body: cartItem.productTitle
            })
        });
    };
};

export const fetchOrders = () => async (dispatch, getState) => {
    const { userId } = getState().auth;
    try {
        const response = await fetch(`https://rn-complete-guide-b962a.firebaseio.com/orders/${userId}.json`);
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        const resData = await response.json();
        const loadedOrders = resData && Object.keys(resData).map(key => new Order(
            key,
            resData[key].order,
            resData[key].amount,
            resData[key].date
        )) || [];
        dispatch({
            type: SET_ORDERS,
            payload: loadedOrders
        });
    } catch (err) {
        throw err
    }
}