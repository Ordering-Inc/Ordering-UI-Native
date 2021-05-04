import * as React from 'react';
import { ImageSourcePropType, ImageStyle, ViewStyle } from 'react-native';
interface Props {
    bgColor?: string;
    borderColor?: string;
    isRequired?: boolean;
    requiredMsg?: string;
    isDisabled?: boolean;
    isSecured?: boolean;
    style?: ViewStyle;
    placeholder?: string;
    icon?: ImageSourcePropType;
    iconRight?: ImageSourcePropType;
    iconColor?: string;
    iconRightColor?: string;
    iconStyle?: ImageStyle;
    iconRightStyle?: ImageStyle;
    iconCustomRight?: any;
    value?: string;
    onChange?: any;
    name?: string;
    type?: string;
    multiline?: boolean;
    vertorIcon?: string;
    vectorIconColor?: string;
    autoCapitalize?: string;
    autoCompleteType?: string;
    autoCorrect?: boolean;
    keyboardType?: string;
}
declare const OInput: {
    (props: Props): React.ReactElement;
    defaultProps: {
        iconColor: string;
        bgColor: string;
        borderColor: string;
    };
};
export default OInput;
