import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Platform } from "react-native";
;

const OToggleSwitch = props => {
  const calculateDimensions = size => {
    switch (size) {
      case "small":
        return {
          width: 40,
          padding: 10,
          circleWidth: 15,
          circleHeight: 15,
          translateX: 22
        };

      case "large":
        return {
          width: 70,
          padding: 20,
          circleWidth: 30,
          circleHeight: 30,
          translateX: 38
        };

      default:
        return {
          width: 50,
          padding: 15,
          circleWidth: 25,
          circleHeight: 25,
          translateX: 30
        };
    }
  };

  const offsetX = new Animated.Value(0);
  const dimensions = calculateDimensions(props.size || 'medium');

  const createToggleSwitchStyle = () => [{
    justifyContent: "center",
    width: dimensions.width,
    borderRadius: 20,
    padding: dimensions.padding,
    backgroundColor: props.isOn ? props.onColor : props.offColor
  }, props.isOn ? props.trackOnStyle : props.trackOffStyle];

  const createInsideCircleStyle = () => [{
    alignItems: "center",
    justifyContent: "center",
    margin: Platform.OS === "web" ? 0 : 4,
    left: Platform.OS === "web" ? 4 : 0,
    position: "absolute",
    backgroundColor: props.circleColor,
    transform: [{
      translateX: offsetX
    }],
    width: dimensions.circleWidth,
    height: dimensions.circleHeight,
    borderRadius: dimensions.circleWidth / 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 1.5
  }, props.isOn ? props.thumbOnStyle : props.thumbOffStyle];

  const {
    isOn,
    onToggle,
    disabled,
    labelStyle,
    label,
    icon
  } = props;
  const toValue = isOn ? dimensions.width - dimensions.translateX : 0;
  Animated.timing(offsetX, {
    toValue,
    duration: props.animationSpeed,
    useNativeDriver: props.useNativeDriver || false
  }).start();
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, label ? /*#__PURE__*/React.createElement(Text, {
    style: [styles.labelStyle, labelStyle]
  }, label) : null, /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: createToggleSwitchStyle(),
    activeOpacity: 0.8,
    onPress: () => disabled ? null : onToggle(!isOn)
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: createInsideCircleStyle()
  }, icon)));
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center"
  },
  labelStyle: {
    marginHorizontal: 10
  }
});
OToggleSwitch.defaultProps = {
  isOn: false,
  onColor: "#4cd137",
  offColor: "#ecf0f1",
  size: "medium",
  labelStyle: {},
  thumbOnStyle: {},
  thumbOffStyle: {},
  trackOnStyle: {},
  trackOffStyle: {},
  icon: null,
  disabled: false,
  animationSpeed: 300,
  useNativeDriver: true,
  circleColor: 'white'
};
export default OToggleSwitch;
//# sourceMappingURL=OToggle.js.map