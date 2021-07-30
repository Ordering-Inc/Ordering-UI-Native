import styled, { css } from 'styled-components/native'

export const DTContainer = styled.View`
`

export const DTWrapperTips = styled.ScrollView`
`

export const DTCard = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  text-transform: capitalize;
  min-height: 60px;
  min-width: 60px;
  margin-right: 10px;
  margin-top: 10px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray};
`

export const DTForm = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const DTLabel = styled.Text`
  font-size: 16px;
  align-self: flex-start;

  ${(props: any) => props.theme?.rtl && css`
    margin-left: 20px;
    margin-right: 0;
  `}
`

export const DTWrapperInput = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`
