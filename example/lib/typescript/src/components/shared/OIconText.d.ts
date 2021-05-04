import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
interface Props {
    icon?: any;
    text?: string;
    size?: number;
    color?: string;
    style?: ViewStyle;
    imgStyle?: ImageStyle;
    textStyle?: TextStyle;
}
declare const OIconText: {
    (props: Props): JSX.Element;
    defaultProps: {};
};
export default OIconText;
