import { useLinkProps } from '@react-navigation/native';
import * as React from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Props {
    onColor: string;
    offColor: string;
    label: string;
    onToggle: () => void;
    style: object;
    isOn: boolean;
    labelStyle: object;
    size?: string;
}

interface DefaultProps {
    onColor: string;
    offColor: string;
    label: string;
    onToggle: () => void;
    style: object;
    isOn: boolean;
    labelStyle: object;
}

export default class OToggle extends React.PureComponent<Props> {
    animatedValue = new Animated.Value(0);

    static defaultProps: DefaultProps = {
        onColor: '#4cd137',
        offColor: '#ecf0f1',
        label: '',
        onToggle: () => { },
        style: {},
        isOn: false,
        labelStyle: {},
    };

    render() {
        const moveToggle = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 20],
        });

        const {
            isOn,
            onColor,
            offColor,
            style,
            onToggle,
            labelStyle,
            label,
            size,
        } = this.props;

        const color = isOn ? onColor : offColor;

        this.animatedValue.setValue(isOn ? 0 : 1);

        Animated.timing(this.animatedValue, {
            toValue: isOn ? 1 : 0,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false
        }).start();

        return (
            <View style={styles.container}>
                {!!label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

                <TouchableOpacity
                    onPress={() => {
                        typeof onToggle === 'function' && onToggle();
                    }}>
                    <View
                        style={[size == 'small' ? styles.sToggleContainer : styles.toggleContainer, style, { backgroundColor: color }]}>
                        <Animated.View
                            style={[
                                size == 'small' ? styles.sToggleWheelStyle : styles.toggleWheelStyle,
                                {
                                    marginLeft: moveToggle,
                                },
                            ]}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleContainer: {
        width: 50,
        height: 30,
        marginLeft: 3,
        borderRadius: 15,
        justifyContent: 'center',
    },
    sToggleContainer: {
        width: 40,
        height: 20,
        marginLeft: 3,
        borderRadius: 10,
        justifyContent: 'center',
    },
    label: {
        marginRight: 2,
    },
    toggleWheelStyle: {
        width: 25,
        height: 25,
        backgroundColor: 'white',
        borderRadius: 12.5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.5,
        elevation: 1.5,
    },
    sToggleWheelStyle: {
        width: 15,
        height: 15,
        backgroundColor: 'white',
        borderRadius: 7.5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.5,
        elevation: 1.5,
    },
});
