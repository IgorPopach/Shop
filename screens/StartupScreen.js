import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { View, ActivityIndicator, StyleSheet, AsyncStorage } from 'react-native';

import Colors from '../constants/Colors';
import { storeUser } from '../store/actions/auth';

const StartupScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if (!userData) {
                navigation.navigate('Auth');
                return;
            };
            const transformedData = JSON.parse(userData);
            const { token, userId, expirationDate } = transformedData;
            if (new Date(expirationDate) <= new Date() || !token || !userId) {
                navigation.navigate('Auth');
                return;
            };

            const expirationTime = new Date(expirationDate).getTime() - new Date().getTime();
            navigation.navigate('Shop');
            dispatch(storeUser({ token, userId }, expirationTime));
        };

        tryLogin();
    }, [dispatch]);
    return (<View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
    </View>)
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default StartupScreen;