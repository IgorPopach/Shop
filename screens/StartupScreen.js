import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { View, ActivityIndicator, StyleSheet, AsyncStorage } from 'react-native';

import Colors from '../constants/Colors';
import { storeUser, setDidTryAL } from '../store/actions/auth';

const StartupScreen = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if (!userData) {
                dispatch(setDidTryAL());
                return;
            };
            const transformedData = JSON.parse(userData);
            const { token, userId, expirationDate } = transformedData;
            if (new Date(expirationDate) <= new Date() || !token || !userId) {
                dispatch(setDidTryAL());
                return;
            };

            const expirationTime = new Date(expirationDate).getTime() - new Date().getTime();
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