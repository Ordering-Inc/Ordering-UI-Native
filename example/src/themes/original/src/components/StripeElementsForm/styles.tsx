import styled, { css } from 'styled-components/native';
import { colors } from '../../theme.json';

export const ErrorMessage = styled.View`
  color: ${colors.cancelColor};
  font-size: 24px;
  padding-left: 10px;
  font-weight: bold;
  opacity: 0.8;
  /* ${(props: any) => props.theme?.rtl && css`
    padding-right: 10px;
    padding-left: 0px;
  `} */
`;
