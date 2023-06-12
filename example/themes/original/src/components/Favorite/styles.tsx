import styled, { css } from 'styled-components/native'

export const TabContainer = styled.View`
  flex-direction: row;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
  border-bottom-width: 1px;
  margin-bottom: 25px;
`

export const Tab = styled.TouchableOpacity`
  margin-right: 32px;
  ${(props: any) => props.active && css`
    border-bottom-color: ${(props: any) => props.theme.colors.textNormal};
    border-bottom-width: 1px;
  `}
`

export const Container = styled.View`
  padding-bottom: 20px;
`
