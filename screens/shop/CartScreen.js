import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import CartItem from '../../components/shop/CartItem';
import { removeFromCart } from '../../store/actions/cart';
import { addNewOrder } from '../../store/actions/orders';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';

const CartScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const dispatch = useDispatch();
    const cartItems = useSelector(state => {
        const items = state.cart.items
        return Object.keys(items).map(key => ({
            ...items[key],
            productId: key,
        })).sort((a, b) => a.productId > b.productId ? 1 : -1)
    });

    const sendOrderHandler = async () => {
        setIsLoading(true);
        await dispatch(addNewOrder(cartItems, cartTotalAmount));
        setIsLoading(false);
    }

    return (
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.summaryText}>
                    Total:<Text style={styles.amount}>${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}</Text>
                </Text>
                {isLoading ?
                    <View>
                        <ActivityIndicator size='large' color={Colors.primary} />
                    </View> :
                    <Button
                        color={Colors.accent}
                        title="Order Now"
                        disabled={cartItems.length === 0}
                        onPress={sendOrderHandler}
                    />}
            </Card>
            <FlatList
                data={cartItems}
                keyExtractor={item => item.productId}
                renderItem={({ item }) =>
                    <CartItem
                        {...{ item }}
                        onRemove={() => { dispatch(removeFromCart(item.productId)) }}
                        deletable
                    />}
            />
        </View>
    )
};

export const screenOptions = {
    headerTitle: 'Your Cart'
};

const styles = StyleSheet.create({
    screen: {
        margin: 20
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 20,
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    amount: {
        color: Colors.primary
    },
});

export default CartScreen;