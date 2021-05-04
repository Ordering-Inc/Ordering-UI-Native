interface ItemProps {
    text?: string;
    image?: any;
}
interface Props {
    items: Array<ItemProps>;
    background?: string;
    labelStyle?: string;
    selectedIdx?: number;
    onSelectItem?: any;
}
declare const OSegment: {
    (props: Props): JSX.Element;
    defaultProps: {
        labelStyle: string;
    };
};
export default OSegment;
