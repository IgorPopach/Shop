import React from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

const CartItem = ({ item, onRemove, deletable }) => {
    return (
        <View style={styles.cartItem}>
            <View style={styles.infoBlock}>
                <Text style={styles.quantity}>{item.quantity} </Text>
                <Text style={styles.title}>{item.productTitle}</Text>
            </View>
            <View style={styles.infoBlock}>
                <Text style={styles.amount}>${item.sum.toFixed(2)}</Text>
                {deletable && <TouchableOpacity onPress={onRemove} style={styles.deleteBtn}>
                    <Ionicons
                        name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                        size={23}
                        color='red'
                    />
                </TouchableOpacity>}
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        padding: 10,
        backgroundColor: 'white',
    },
    infoBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantity: {
        fontFamily: 'open-sans',
        color: '#888',
        fontSize: 16
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    amount: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    deleteBtn: {
        marginLeft: 20
    }
});

export default CartItem;