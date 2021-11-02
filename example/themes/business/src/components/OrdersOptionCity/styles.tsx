import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  margin-bottom: 24px;
  ${(props: any) => props.isIos && css`
    z-index: 18;
  `}
`;
