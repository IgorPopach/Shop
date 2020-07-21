import React from 'react';
import { ScrollView, View, Text, Button, Image, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import { addToCart } from '../../store/actions/cart';

const ProductDetailScreen = ({ route }) => {
    const products = useSelector(state => state.products.availableProducts);
    const productId = route.params.productId;
    const product = products.find(product => product.id === productId);
    const dispatch = useDispatch();
    return (
        <ScrollView>
            <View style={styles.container}>
                <Image source={{ uri: product.imageUrl }} style={styles.image} />
                <View style={styles.button}>
                    <Button
                        color={Colors.primary}
                        title="Add to Cart"
                        onPress={() => dispatch(addToCart(product))}
                    />
                </View>
                <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                <Text style={styles.description}>{product.description}</Text>
            </View>
        </ScrollView>
    )
};

export const screenOptions = navData => ({
    headerTitle: navData.route.params.productTitle
})

const styles = StyleSheet.create({
    container: {
        // justifyContent: 'space-between'
    },
    image: {
        width: '100%',
        height: 300
    },
    button: {
        marginVertical: 10,
        alignItems: 'center'
    },
    price: {
        fontFamily: 'open-sans-bold',
        fontSize: 20,
        color: '#888',
        marginVertical: 20,
        textAlign: 'center'
    },
    description: {
        fontFamily: 'open-sans',
        fontSize: 14,
        paddingHorizontal: 30
    }
});

export default ProductDetailScreen;