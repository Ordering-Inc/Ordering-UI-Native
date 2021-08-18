import styled from 'styled-components/native';

export const Wrapper = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.white};
`;

export const Header = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
  border-radius: 7.6px;
  flex: 1;
`;

export const TitleHeader = styled.View`
  margin-left: 11px;
`;
