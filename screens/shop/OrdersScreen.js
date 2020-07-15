import React, { useEffect, useState } from 'react';
import { View, Text, Alert, FlatList, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import { fetchOrders } from '../../store/actions/orders';
import Colors from '../../constants/Colors';

const OrdersScreen = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();
    useEffect(() => {
        setError(null);
        setIsLoading(true);
        dispatch(fetchOrders())
            .then(() => { setIsLoading(false) })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
            });
    }, [dispatch, fetchOrders]);

    useEffect(() => {
        if (error) {
            Alert.alert(`Something went wrong`, error, [{ text: 'Okay' }])
        }
    }, [error]);

    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    };

    if (orders.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>Don't have any orders...</Text>
            </View>
        )
    }
    return (
        <FlatList
            data={orders}
            keyExtractor={item => item.id}
            renderItem={({ item }) =>
                <OrderItem
                    items={item.items}
                    amount={item.amount}
                    date={item.readableDate}
                />}
        />
    )
};

OrdersScreen.navigationOptions = navData => ({
    headerTitle: 'Your Orders',
    headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton} >
        <Item
            title="Menu"
            iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
            onPress={() => {
                navData.navigation.toggleDrawer()
            }}
        />
    </HeaderButtons>,
    headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton} >
        <Item
            title="Cart"
            iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
            onPress={() => {
                navData.navigation.navigate('Cart')
            }}
        />
    </HeaderButtons>
});

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default OrdersScreen;