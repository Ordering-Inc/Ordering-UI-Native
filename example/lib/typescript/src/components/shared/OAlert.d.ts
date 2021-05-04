interface Props {
    children: any;
    title: string;
    message?: string;
    onCancel?: any;
    onAccept?: any;
    onClick?: () => void;
    disabled?: boolean;
}
declare const OAlert: (props: Props) => JSX.Element;
export default OAlert;
