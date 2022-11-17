import React, { useRef } from 'react'
import Lottie from 'lottie-react-native';
import { TouchableOpacity, Easing, StyleSheetProperties, ViewStyle, Animated } from 'react-native';

interface Props {
    src: string,
    initialValue: number,
    children: React.ReactChild,
    onClick: any,
    disableAnimation?: boolean
    toValue: number,
    style?: ViewStyle
}

export const LottieProvider = (props: Props) => {
    const {
        src,
        initialValue,
        children,
        onClick,
        disableAnimation,
        toValue,
        style
    } = props
    const animationProgress = useRef(new Animated.Value(initialValue))

    const onPressLottie = () => {
        if (!disableAnimation) {
            Animated.timing(animationProgress.current, {
                toValue,
                duration: 5000,
                easing: Easing.linear,
                useNativeDriver: true
            }).start();
        }
        onClick()
    }

    return (
        <TouchableOpacity
            onPress={onPressLottie}
            style={style}
        >
            <Lottie
                progress={animationProgress.current}
                source={src}
            />
            {children}
        </TouchableOpacity>
    )
}
