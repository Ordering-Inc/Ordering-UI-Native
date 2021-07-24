import styled, { css } from 'styled-components/native';

export const Card = styled.View`
  flex: 1;
  padding: 10px;
  flex-direction: row;
  margin-bottom: 24px;
  min-height: 64px;
`;

export const Information = styled.View`
  justify-content: space-between;
  align-items: flex-start;
  margin-horizontal: 10px;
  padding-vertical: 1px;
  flex: 1;
  min-height: 64px;
`;

export const Logo = styled.View`
  shadow-color: ${(props: any) => props.theme.colors.shadow};
  elevation: 1;
  width: 75px;
  height: 75px;
  border-radius: 7.6px;
`;
