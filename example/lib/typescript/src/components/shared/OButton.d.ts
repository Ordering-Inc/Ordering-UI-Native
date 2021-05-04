import { ImageSourcePropType, ImageStyle, TextStyle, ViewStyle } from 'react-native';
import * as React from 'react';
interface Props {
    testID?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
    onClick?: () => void;
    style?: ViewStyle;
    parentStyle?: ViewStyle;
    disabledStyle?: ViewStyle;
    textStyle?: TextStyle;
    imgLeftSrc?: ImageSourcePropType;
    imgLeftStyle?: ImageStyle;
    imgRightSrc?: any;
    imgRightStyle?: ImageStyle;
    indicatorColor?: string;
    activeOpacity?: number;
    text?: string;
    isCircle?: boolean;
    bgColor?: string;
    borderColor?: string;
}
declare const OButton: {
    (props: Props): React.ReactElement;
    defaultProps: {
        isLoading: boolean;
        isDisabled: boolean;
        indicatorColor: string;
        activeOpacity: number;
        imgRightSrc: any;
    };
};
export default OButton;
