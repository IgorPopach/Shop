import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { View, ScrollView, Button, KeyboardAvoidingView, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import { signup, login } from '../../store/actions/auth';
import Colors from '../../constants/Colors';

const FORM_UPDATE = 'FORM_UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        }
        const formIsValid = Object.values(updatedValidities).every(isValid => isValid === true);
        return {
            inputValues: updatedValues,
            inputValidities: updatedValidities,
            formIsValid
        };
    }
    return state;
}

const AuthScreen = ({ navigation }) => {
    const [isSignup, setIsSignup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: '',
        },
        inputValidities: {
            email: false,
            password: false,
        },
        formIsValid: false
    });

    const TextChangeHandler = useCallback((inputIdentifier, { value, isValid }) => {
        dispatchFormState({
            type: FORM_UPDATE,
            value,
            isValid,
            input: inputIdentifier
        })
    }, [dispatchFormState]);

    const authHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form', [
                {
                    text: 'Okay'
                }
            ])
            return;
        };
        setError(null);
        setIsLoading(true);
        try {
            if (isSignup) {
                await dispatch(signup(formState.inputValues.email, formState.inputValues.password));
            } else {
                await dispatch(login(formState.inputValues.email, formState.inputValues.password));
            }
            navigation.navigate('Shop');
        } catch (err) {
            setError(err.message)
            setIsLoading(false);
        }
    }, [dispatch, isSignup, formState.inputValues.email, formState.inputValues.password]);

    const toggleBtn = useCallback(() => {
        setIsSignup(prevState => !prevState)
    }, [isSignup]);

    useEffect(() => {
        if (error) {
            Alert.alert('An error accurred!', error, [{ text: 'Okay' }])
        }
    }, [error]);

    return (
        <KeyboardAvoidingView
            behavior='padding'
            keyboardVerticalOffset={10}
            style={styles.container}
        >
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
                <Card style={styles.card}>
                    <ScrollView>
                        <Input
                            id='email'
                            label='E-mail'
                            email
                            required
                            errorText='Input valid Email'
                            keyboardType='email-address'
                            autoCapitalized='none'
                            onInputChange={TextChangeHandler}
                            initialValue={formState.inputValues.email}
                        />
                        <Input
                            id='password'
                            label='Password'
                            password
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalized='none'
                            errorText='Input valid password'
                            keyboardType='default'
                            onInputChange={TextChangeHandler}
                            initialValue={formState.inputValues.password}
                        />
                        <View style={styles.buttonContainer}>
                            {isLoading ?
                                <ActivityIndicator size='large' color={Colors.primary} /> :
                                <Button
                                    title={isSignup ? "Sign Up" : "Login"}
                                    color={Colors.primary}
                                    onPress={authHandler}
                                />}
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                title={isSignup ? "Switch to Login" : "Switch to Sign Up"}
                                color={Colors.accent}
                                onPress={toggleBtn}
                            />
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
};

AuthScreen.navigationOptions = navData => ({
    headerTitle: 'Authentication'
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        width: '80%',
        maxHeight: 400,
        maxWidth: 400,
        padding: 15
    },
    buttonContainer: {
        marginTop: 10,
        paddingHorizontal: 10
    }
});

export default AuthScreen; 