import styled from 'styled-components/native';

export const ProgressBar = styled.View`
  height: 4px;
  background: ${(props: any) => props.theme.colors.textNormal};
`

export const ProgressContentWrapper = styled.View`
  height: 4px;
  background: #F8F9FA;
  margin-bottom: 10px;
  flex: 1;
`
