import React from 'react';
import { View, Text, FlatList, Button, Platform, Alert, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import { deleteProduct } from '../../store/actions/products';
import Colors from '../../constants/Colors';


const UserProductsScreen = ({ navigation }) => {
    const data = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();

    const deleteHandler = (id) => {
        Alert.alert('Are you sure?', 'Do you want to delete this item?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: () => {
                    dispatch(deleteProduct(id))
                }
            },
        ]);
    };
    const editProductHandler = (id) => {
        navigation.navigate('EditProduct', { id })
    }

    if (data.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No products found...</Text>
                <Text>Start adding some!</Text>
            </View>
        )
    }
    return <FlatList
        {...{ data }}
        keyExtractor={item => item.id}
        renderItem={({ item }) =>
            <ProductItem
                {...item}
                onSelect={editProductHandler.bind(this, item.id)}
            >
                <Button
                    color={Colors.primary}
                    title="Edit"
                    onPress={editProductHandler.bind(this, item.id)}
                />
                <Button
                    color={Colors.primary}
                    title="Delete"
                    onPress={deleteHandler.bind(this, item.id)}
                />
            </ProductItem>}
    />
};

export const screenOptions = navData => ({
    headerTitle: 'Your Products',
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
            title="Add"
            iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
            onPress={() => {
                navData.navigation.navigate('EditProduct');
            }}
        />
    </HeaderButtons>
});

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default UserProductsScreen;