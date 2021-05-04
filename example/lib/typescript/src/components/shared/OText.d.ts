import * as React from 'react';
import { TextStyle } from 'react-native';
interface Props {
    color?: string;
    size?: number;
    weight?: any;
    style?: TextStyle;
    children?: JSX.Element | JSX.Element[] | string;
    isWrap?: boolean;
    hasBottom?: boolean;
    mBottom?: any;
    space?: any;
    mRight?: number;
    mLeft?: number;
    numberOfLines?: number;
    ellipsizeMode?: string;
}
declare const OText: (props: Props) => React.ReactElement;
export default OText;
