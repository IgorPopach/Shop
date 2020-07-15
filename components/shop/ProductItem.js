import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    TouchableNativeFeedback,
    Platform
} from 'react-native';

import Card from '../UI/Card';

const ProductItem = ({ imageUrl, title, price, children, onSelect }) => {
    let TouchableComponent = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableComponent = TouchableNativeFeedback;
    }

    return (
        <Card style={styles.product}>
            <View style={styles.touchable}>
                <TouchableComponent onPress={onSelect} useForeground>
                    <View>
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} source={{ uri: imageUrl }} />
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.title} >{title}</Text>
                            <Text style={styles.price} >${price.toFixed(2)}</Text>
                        </View>
                        <View style={styles.actions} >
                            {children}
                        </View>
                    </View>
                </TouchableComponent>
            </View>
        </Card>
    )
};

const styles = StyleSheet.create({
    product: {
        // shadowColor: 'black',
        // shadowOpacity: 0.26,
        // shadowOffset: { width: 0, height: 2 },
        // shadowRadius: 8,
        // elevation: 5,
        // borderRadius: 10,
        // backgroundColor: 'white',
        height: 300,
        margin: 20,
    },
    touchable: {
        borderRadius: 10,
        overflow: 'hidden'
    },
    imageContainer: {
        width: '100%',
        height: '60%',
    },
    image: {
        width: '100%',
        height: '100%'
    },
    details: {
        alignItems: 'center',
        height: '17%',
        padding: 10
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        marginVertical: 2
    },
    price: {
        fontFamily: 'open-sans',
        fontSize: 14,
        color: '#888'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '23%',
        marginHorizontal: 20
    }
});

export default ProductItem;