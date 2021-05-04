interface Props {
    label?: string;
    checked?: boolean;
    onChange?: any;
    checkColor?: string;
    textColor?: string;
    size?: number;
}
declare const OCheckbox: {
    (props: Props): JSX.Element;
    defaultProps: {
        checkColor: string;
        textColor: string;
    };
};
export default OCheckbox;
