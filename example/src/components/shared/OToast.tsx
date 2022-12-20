import * as React from "react";
import { Animated, StyleSheet, Text, View, Platform } from "react-native";
import { ToastType, useToast, useLanguage } from "ordering-components/native";
import { useTheme } from 'styled-components/native';
import { getTraduction } from '../../utils'

const fadeDuration = 300;
const topPosition = Platform.OS === 'ios' ? 40 : 20

export const Toast = (props: any) => {
  const [toastConfig, { hideToast }] = useToast();
  const [, t] = useLanguage()
  const opacity = React.useRef(new Animated.Value(0)).current;
  const theme = useTheme();

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
      hideToast && hideToast();
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
      backgroundColor = theme.colors.toastInfo || '#6BA4FF';
      break;
    case ToastType.Error:
      backgroundColor = theme.colors.toastError || '#D83520';
      break;
    case ToastType.Success:
      backgroundColor = theme.colors.toastSuccess || '#90C68E';
      break;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { top: topPosition, opacity },
      ]}
    >
      <View style={[styles.toast, { backgroundColor }]}>
        <Text style={{ ...styles.message, ...props.messageStyle }}>{getTraduction(message, t)}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    position: "absolute",
    maxWidth: 480,
    zIndex: 9999999999
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
