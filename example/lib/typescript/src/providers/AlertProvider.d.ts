interface Props {
    open: boolean;
    title: string;
    content: Array<string>;
    onClose: () => void;
    onAccept: () => void;
}
declare const Alert: (props: Props) => JSX.Element;
export default Alert;
