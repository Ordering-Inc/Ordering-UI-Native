import styled, { css } from 'styled-components/native';

export const ErrorMessage = styled.View`
  color: ${({ colors }: any) => colors.cancelColor};
  font-size: 24px;
  padding-left: 10px;
  font-weight: bold;
  opacity: 0.8;
`;
