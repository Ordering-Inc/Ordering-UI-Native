import React from 'react';
import styled, { css } from 'styled-components/native';
import { colors } from '../theme';
const ContainerStyled = styled.ScrollView`
  flex: 1;
  ${props => !props.nopadding && css`
    padding: 20px;
  `}
  background-color: ${colors.backgroundPage};
`;
const SafeAreStyled = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.backgroundPage};
`;
export const Container = props => {
  return /*#__PURE__*/React.createElement(SafeAreStyled, null, /*#__PURE__*/React.createElement(ContainerStyled, null, props.children));
};
//# sourceMappingURL=Container.js.map