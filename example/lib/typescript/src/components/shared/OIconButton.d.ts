import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
interface Props {
    icon?: any;
    title?: string;
    onClick?: any;
    height?: number;
    isOutline?: boolean;
    disabled?: boolean;
    color?: string;
    bgColor?: string;
    borderColor?: string;
    textColor?: string;
    iconColor?: string;
    style?: ViewStyle;
    iconStyle?: ImageStyle;
    textStyle?: TextStyle;
    disabledColor?: string;
    iconCover?: boolean;
    urlIcon?: any;
    cover?: any;
}
declare const OIconButton: {
    (props: Props): JSX.Element;
    defaultProps: {};
};
export default OIconButton;
