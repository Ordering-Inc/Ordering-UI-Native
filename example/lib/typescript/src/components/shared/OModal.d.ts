import * as React from 'react';
interface Props {
    open?: boolean;
    title?: string;
    children?: any;
    onAccept?: any;
    onCancel?: any;
    onClose?: any;
    style?: any;
    acceptText?: string;
    cancelText?: string;
    isTransparent?: boolean;
    hideCloseDefault?: boolean;
    entireModal?: boolean;
    customClose?: boolean;
    titleSectionStyle?: any;
    isNotDecoration?: boolean;
}
declare const OModal: (props: Props) => React.ReactElement;
export default OModal;
