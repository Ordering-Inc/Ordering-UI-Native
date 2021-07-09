import * as React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ToastType, useToast } from "../../providers/ToastProvider";

const fadeDuration = 300;
const bottomPosition = 20;

export const Toast: React.FC = () => {
    // const insets = useSafeAreaInsets();
    const { toastConfig, hideToast } = useToast();
    const opacity = React.useRef(new Animated.Value(0)).current;

    const fadeIn = React.useCallback(() => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: fadeDuration,
            useNativeDriver: true,
        }).start();
    }, [opacity]);

    const fadeOut = React.useCallback(() => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: fadeDuration,
            useNativeDriver: true,
        }).start(() => {
            hideToast();
        });
    }, [opacity, hideToast]);

    React.useEffect(() => {
        if (!toastConfig) {
            return;
        }

        fadeIn();
        const timer = setTimeout(fadeOut, toastConfig.duration);

        return () => clearTimeout(timer);
    }, [toastConfig, fadeIn, fadeOut]);

    if (!toastConfig) {
        return null;
    }

    const { type, message } = toastConfig;

    let backgroundColor;
    switch (type) {
        case ToastType.Info:
            backgroundColor = '#6ba4ff';
            break;
        case ToastType.Error:
            backgroundColor = '#ff3d3d';
            break;
        case ToastType.Success:
            backgroundColor = '#73bd24';
            break;
    }

    return (
        <Animated.View
            style={[
                styles.container,
                { bottom: bottomPosition, opacity },
            ]}
        >
            <View style={[styles.toast, { backgroundColor }]}>
                <Text style={styles.message}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        position: "absolute",
        maxWidth: 480
    },
    toast: {
        borderRadius: 16,
        padding: 16,
    },
    message: {
        fontSize: 14,
        textAlign: "center",
        color: '#fff',
    },
});
