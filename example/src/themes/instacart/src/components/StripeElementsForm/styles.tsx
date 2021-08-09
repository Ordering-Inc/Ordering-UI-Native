import styled from 'styled-components/native';

export const ErrorMessage = styled.View`
  color: ${(props: any) => props.theme.colors.cancelColor};
  font-size: 24px;
  padding-left: 10px;
  font-weight: bold;
  opacity: 0.8;
`;
