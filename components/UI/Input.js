import React, { useReducer, useCallback, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';

const inputReducer = (state, { type, value, isValid }) => {
    switch (type) {
        case INPUT_CHANGE:
            return {
                ...state,
                value,
                isValid
            }
        case INPUT_BLUR:
            return {
                ...state,
                touched: true
            }
    }
    return state;
};

const Input = React.forwardRef(({ id, label, isValid, initialValue, errorText, onInputChange, ...props }, ref) => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: initialValue || '',
        isValid,
        touched: false
    })

    const onChangeText = useCallback((text) => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = true;
        if (props.required && text.trim().length === 0) {
            isValid = false;
        }
        if (props.email && !emailRegex.test(text.toLowerCase())) {
            isValid = false;
        }
        if (props.min != null && +text < props.min) {
            isValid = false;
        }
        if (props.max != null && +text > props.max) {
            isValid = false;
        }
        if (props.minLength != null && text.length < props.minLength) {
            isValid = false;
        }
        dispatch({ type: INPUT_CHANGE, value: text, isValid })
    }, []);

    const onBlur = () => dispatch({ type: INPUT_BLUR });

    useEffect(() => {
        if (inputState.touched) {
            onInputChange(id, inputState);
        }
    }, [inputState, onInputChange, id]);

    return (
        <View>
            <View style={styles.formControl}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                    ref={ref}
                    style={styles.textInput}
                    {...{ value: inputState.value, onChangeText, onBlur, ...props }}
                />
            </View>
            {!inputState.isValid && inputState.touched &&
                (<View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorText}</Text>
                </View>)}
        </View>
    );
});

const styles = StyleSheet.create({
    formControl: {
        width: '100%',
        marginVertical: 10
    },
    label: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        marginBottom: 5
    },
    textInput: {
        fontFamily: 'open-sans-bold',
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#888',
        borderRadius: 5
    },
    errorContainer: {
        marginVertical: 5
    },
    errorText: {
        fontFamily: 'open-sans',
        color: 'red',
        fontSize: 14
    }
});

export default Input;