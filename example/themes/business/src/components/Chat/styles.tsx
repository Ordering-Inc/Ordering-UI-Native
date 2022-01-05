import styled from 'styled-components/native';

export const Wrapper = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.white};
`;

export const Header = styled.ScrollView``;

export const TitleHeader = styled.View`
  margin-left: 11px;
`;

export const QuickMessageContainer = styled.ScrollView`
  margin-top: 8px;
`