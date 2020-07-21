import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import { addToCart } from '../../store/actions/cart';
import { fetchProducts } from '../../store/actions/products';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const selectItemHandler = (id, title) => {
        navigation.navigate('ProductDetail',
            {
                productId: id,
                productTitle: title
            }
        )
    }

    const loadProducts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(fetchProducts());
        } catch (err) {
            setError(err.message)
        }
        setIsRefreshing(false);
    }, [dispatch]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadProducts)
        return () => {
            unsubscribe();
        }
    }, [loadProducts]);

    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(() => setIsLoading(false));
    }, [dispatch, loadProducts]);

    if (error) {
        return <View style={styles.centered}>
            <Text>An error occurred!</Text>
            <Button title='Try again' onPress={loadProducts} color={Colors.primary} />
        </View>
    }

    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    }

    if (!isLoading && products.length === 0) {
        return <View style={styles.centered}>
            <Text>No products found. Maybe start adding some!</Text>
        </View>
    }

    return <FlatList
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={products}
        renderItem={({ item }) =>
            <ProductItem {...item} onSelect={selectItemHandler.bind(this, item.id, item.title)}>
                <Button color={Colors.primary} title="Details" onPress={selectItemHandler.bind(this, item.id, item.title)} />
                <Button color={Colors.primary} title="Add to Cart" onPress={() => {
                    dispatch(addToCart(item))
                }} />
            </ProductItem>}
    />
};

export const screenOptions = navData => ({
    headerTitle: 'All Products',
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
})

export default ProductsOverviewScreen;