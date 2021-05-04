import { TextStyle } from "react-native";
interface propTypes {
    isOn: boolean;
    label?: string;
    onColor?: string;
    offColor?: string;
    size?: string;
    labelStyle?: TextStyle;
    thumbOnStyle?: any;
    thumbOffStyle?: any;
    trackOnStyle?: any;
    trackOffStyle?: any;
    onToggle: any;
    icon?: any;
    disabled?: boolean;
    animationSpeed?: number;
    useNativeDriver?: boolean;
    circleColor?: string;
}
declare const OToggleSwitch: {
    (props: propTypes): JSX.Element;
    defaultProps: {
        isOn: boolean;
        onColor: string;
        offColor: string;
        size: string;
        labelStyle: {};
        thumbOnStyle: {};
        thumbOffStyle: {};
        trackOnStyle: {};
        trackOffStyle: {};
        icon: null;
        disabled: boolean;
        animationSpeed: number;
        useNativeDriver: boolean;
        circleColor: string;
    };
};
export default OToggleSwitch;
