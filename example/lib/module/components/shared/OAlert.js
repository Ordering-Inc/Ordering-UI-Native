import * as React from 'react';
import styled from 'styled-components/native';
import { Alert } from 'react-native';
import { useLanguage } from 'ordering-components/native';
const Wrapper = styled.TouchableOpacity`
	
`;

const OAlert = props => {
  const [, t] = useLanguage();

  const createTwoButtonAlert = () => {
    Alert.alert(props.title, props.message, [{
      text: t('CANCEL', 'cancel'),
      onPress: () => props.onCancel && props.onCancel(),
      style: 'cancel'
    }, {
      text: t('ACCEPT', 'Accept'),
      onPress: () => props.onAccept && props.onAccept()
    }], {
      cancelable: false
    });
  };

  const handleClick = () => {
    props.onClick && props.onClick();
    createTwoButtonAlert();
  };

  return /*#__PURE__*/React.createElement(Wrapper, {
    onPress: handleClick,
    disabled: props.disabled
  }, props.children);
};

export default OAlert;
//# sourceMappingURL=OAlert.js.map