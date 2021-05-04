import * as React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
import { getTraduction } from '../utils';
import { useLanguage } from 'ordering-components/native';
import { colors } from '../theme';

const Alert = props => {
  const {
    open,
    title,
    content,
    onClose,
    onAccept
  } = props;
  const [, t] = useLanguage();

  const parseContent = list => {
    let allMessages = '';
    list === null || list === void 0 ? void 0 : list.map(message => {
      allMessages = `* ${getTraduction(message)}\n` + allMessages;
    });
    return allMessages;
  };

  return /*#__PURE__*/React.createElement(AwesomeAlert, {
    show: open,
    showProgress: false,
    title: title,
    message: getTraduction(content === null || content === void 0 ? void 0 : content[0]),
    closeOnTouchOutside: true,
    closeOnHardwareBackPress: false,
    showConfirmButton: true,
    confirmText: t('ACCEPT', 'Accept'),
    confirmButtonColor: colors.primary,
    onCancelPressed: () => onClose(),
    onConfirmPressed: () => onAccept()
  });
};

export default Alert;
//# sourceMappingURL=AlertProvider.js.map