import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
const Wrapper = styled.View`
    flex: 1;
    background-color: white;
    padding-horizontal: 16px;
`;

const MainWrapper = props => {
  const safeAreaInset = useSafeAreaInsets();
  return /*#__PURE__*/React.createElement(Wrapper, {
    style: {
      paddingBottom: safeAreaInset.bottom ? safeAreaInset.bottom + 16 : 16,
      ...props.style
    }
  }, props.children);
};

export default MainWrapper;
//# sourceMappingURL=MainWrapper.js.map