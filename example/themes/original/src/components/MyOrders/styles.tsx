import styled, { css } from 'styled-components/native'

export const Wrapper = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const Tab = styled.TouchableOpacity`
  padding-horizontal: 10px;
  padding-vertical: 10px;
  justify-content: center;
	border-bottom-width: 1px;
`
