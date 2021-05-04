import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
const Wrapper = styled.View`
  box-shadow: 0 -1px 3px #00000010;
  background-color: white;
  height: 60px;
  padding-vertical: 20px;
`;

const BottomWrapper = props => {
  const safeAreaInset = useSafeAreaInsets();
  return /*#__PURE__*/React.createElement(Wrapper, {
    style: {
      paddingBottom: safeAreaInset.bottom || 16,
      ...props.style
    }
  }, props.children);
};

export default BottomWrapper;
//# sourceMappingURL=index.js.map