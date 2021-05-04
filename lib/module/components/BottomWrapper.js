import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
const Wrapper = styled.View`
    border-top-right-radius: 25px;
    border-top-left-radius: 25px;
    box-shadow: 0 -1px 3px #00000010;
    background-color: white;
    margin-top: -20px;
    min-height: 100px;
    padding: 20px;
    padding-bottom: 40px;
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
//# sourceMappingURL=BottomWrapper.js.map