import styled, { css } from 'styled-components/native'

export const Container = styled.View``

export const WrapHeader = styled.TouchableOpacity`
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  background-color: ${(props: any) => props.theme.colors.backgroundGray};
`

export const WrapperOption = styled.View`
  ${((props: any) => props.hidden && css `
    max-height: 0px;
  `)}
`

export const TitleContainer = styled.View`
  width: 70%;
  flex-direction: row;
  align-items: center;
`

export const WrapTitle = styled.View`
`
