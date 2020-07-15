import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, Text, ScrollView, Platform, Alert, KeyboardAvoidingView, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import Input from '../../components/UI/Input';
import { editProduct, createProduct } from '../../store/actions/products';
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

const EditProductScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const prodId = navigation.getParam('id');
    const editedProduct = useSelector(state =>
        state.products.userProducts.find(product => product.id === prodId));

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            price: '',
            description: editedProduct ? editedProduct.description : ''
        },
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            price: editedProduct ? true : false,
            description: editedProduct ? true : false
        },
        formIsValid: editedProduct ? true : false
    })

    const dispatch = useDispatch();

    const submitHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form', [
                {
                    text: 'Okay'
                }
            ])
            return;
        }
        const { title, imageUrl, description, price } = formState.inputValues;
        setError(null);
        setIsLoading(true);
        try {
            if (editedProduct) {
                await dispatch(editProduct({
                    id: prodId,
                    title,
                    imageUrl,
                    description
                }));
            } else {
                await dispatch(createProduct({
                    title,
                    imageUrl,
                    description,
                    price: +price
                }))
            }
            navigation.goBack();
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, prodId, formState]);

    const TextChangeHandler = useCallback((inputIdentifier, { value, isValid }) => {
        dispatchFormState({
            type: FORM_UPDATE,
            value,
            isValid,
            input: inputIdentifier
        })
    }, [dispatchFormState]);


    useEffect(() => { navigation.setParams({ submit: submitHandler }) }, [submitHandler]);

    useEffect(() => {
        if (error) {
            Alert.alert('An error accurred!', error, [{ text: 'Okay' }])
        }
    }, [error]);

    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            KeyboardVerticalOffset={50}
        >
            <ScrollView>
                <View style={styles.form}>
                    <Input
                        id='title'
                        label='Title'
                        initialValue={formState.inputValues.title}
                        isValid={formState.inputValidities.title}
                        required
                        minLength={3}
                        errorText='Please enter a valid title!'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        returnKeyType='next'
                        onInputChange={TextChangeHandler}
                    />
                    <Input
                        id='imageUrl'
                        label='Image URL'
                        initialValue={formState.inputValues.imageUrl}
                        isValid={formState.inputValidities.imageUrl}
                        required
                        minLength={3}
                        errorText='Please enter a valid image url!'
                        returnKeyType='next'
                        onInputChange={TextChangeHandler}
                    />
                    {editedProduct ?
                        null :
                        <Input
                            id='price'
                            label='Price'
                            initialValue={formState.inputValues.price}
                            isValid={formState.inputValidities.price}
                            required
                            errorText='Please enter a valid price!'
                            min={1}
                            max={10000}
                            keyboardType='decimal-pad'
                            returnKeyType='next'
                            onInputChange={TextChangeHandler}
                        />}
                    <Input
                        id='description'
                        label='Description'
                        initialValue={formState.inputValues.description}
                        isValid={formState.inputValidities.description}
                        required
                        minLength={10}
                        errorText='Please enter a valid description!'
                        autoCapitalize='sentences'
                        autocorrect
                        multiline
                        numberOfLines={3}
                        onInputChange={TextChangeHandler}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

EditProductScreen.navigationOptions = navData => {
    const submitFunc = navData.navigation.getParam('submit');

    return {
        headerTitle: navData.navigation.getParam('id') ? 'Edit Product' : 'Add Product',
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton} >
            <Item
                title="Add"
                iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                onPress={submitFunc}
            />
        </HeaderButtons>
    }
};

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default EditProductScreen;