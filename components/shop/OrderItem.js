import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import CartItem from './CartItem';
import Card from '../UI/Card';
import Colors from '../../constants/Colors';

const OrderItem = ({ items, amount, date }) => {
    const [showDetails, setShowDetails] = useState(false);
    return <Card style={styles.orderItem}>
        <View style={styles.summary}>
            <Text style={styles.amount}>${amount.toFixed(2)}</Text>
            <Text style={styles.date}>{date}</Text>
        </View>
        <Button
            color={Colors.primary}
            title={showDetails ? "Hide Details" : "Show Details"}
            onPress={() => {
                setShowDetails(prevState => !prevState)
            }}
        />
        {showDetails && <View style={styles.details}>
            {items.map(item =>
                <CartItem key={item.productId} {...{ item }} />
            )}
        </View>}
    </Card>
};

const styles = StyleSheet.create({
    orderItem: {
        margin: 10,
        padding: 10,
        alignItems: 'center',
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10
    },
    amount: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    date: {
        fontFamily: 'open-sans',
        fontSize: 18,
        color: '#888'
    },
    details: {
        width: '100%'
    }
});

export default OrderItem;