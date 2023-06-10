import styled from 'styled-components/native';

export const CategoryTab = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 10px;
  border-bottom-color: ${(props: any) => props.theme.colors.borderTops};
  border-bottom-width: 1px;
  margin-left: ${(props: any) => props.isSpace ? '10px' : '0px'};
`
