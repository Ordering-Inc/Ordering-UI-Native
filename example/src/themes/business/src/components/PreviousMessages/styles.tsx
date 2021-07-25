import styled from 'styled-components/native';

export const Card = styled.View`
  flex: 1;
  flex-direction: row;
`;

export const Logo = styled.View`
  align-items: center;
  justify-content: center;
  shadow-color: ${(props: any) => props.theme.colors.shadow};
  elevation: 1;
  width: 75px;
  height: 75px;
  border-radius: 7.6px;
`;

export const Information = styled.View`
  justify-content: space-between;
  align-items: flex-start;
  margin-horizontal: 10px;
  flex: 1;
  min-height: 64px;
`;
