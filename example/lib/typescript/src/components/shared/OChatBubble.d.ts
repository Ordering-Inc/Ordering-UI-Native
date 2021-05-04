interface Props {
    side?: string;
    bgColor?: string;
    textColor?: string;
    contents?: any;
    datetime?: string;
    data?: any;
    image?: string;
    onClick?: () => void;
}
declare const OChatBubble: (props: Props) => JSX.Element;
export default OChatBubble;
