import * as React from 'react';
import { ImageStyle } from 'react-native';
interface Props {
    src?: any;
    url?: string;
    dummy?: any;
    color?: string;
    width?: number;
    height?: number;
    style?: ImageStyle;
    isWrap?: boolean;
    cover?: boolean;
    children?: any;
    borderRadius?: number;
}
declare const OImage: {
    (props: Props): React.ReactElement;
    defaultProps: {
        width: number;
        height: number;
    };
};
export default OImage;
