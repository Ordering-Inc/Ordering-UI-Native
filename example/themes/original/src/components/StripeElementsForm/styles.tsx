import styled, { css } from 'styled-components/native';

export const ErrorMessage = styled.View`
  color: ${(props: any) => props.theme.colors.cancelColor};
  font-size: 24px;
  padding-left: 10px;
  font-weight: bold;
  opacity: 0.8;
  /* ${(props: any) => props.theme?.rtl && css`
    padding-right: 10px;
    padding-left: 0px;
  `} */
`;
