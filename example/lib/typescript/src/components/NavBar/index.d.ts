import { TextStyle } from 'react-native';
interface Props {
    navigation?: any;
    route?: any;
    title?: string;
    subTitle?: any;
    titleColor?: string;
    titleAlign?: any;
    withIcon?: boolean;
    icon?: any;
    leftImg?: any;
    isBackStyle?: boolean;
    onActionLeft?: () => void;
    onRightAction?: () => void;
    showCall?: boolean;
    titleStyle?: TextStyle;
    btnStyle?: TextStyle;
    style?: TextStyle;
    paddingTop?: number;
}
declare const NavBar: {
    (props: Props): JSX.Element;
    defaultProps: {
        title: string;
        textAlign: string;
    };
};
export default NavBar;
