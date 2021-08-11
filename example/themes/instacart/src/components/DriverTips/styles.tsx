import styled, { css } from 'styled-components/native'

export const DTContainer = styled.View`
  flex-direction: column;
  justify-content: space-around;
`

export const DTWrapperTips = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`

export const DTCard = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-horizontal: 16px;
  text-transform: capitalize;
  min-height: 30px;
  min-width: 30px;
  border-radius: 3px;
	background-color: ${(props: any) => props.theme.colors.inputDisabled};
  ${(props: any) => props.isActive && css`
    background-color: ${(props: any) => props.theme.colors.primary};;
  `}
`

export const DTForm = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const DTLabel = styled.Text`
  font-size: 12px;
  padding-start: 22px;
  align-self: flex-start;
  color: ${(props: any) => props.theme.colors.textSecondary};

  ${(props: any) => props.theme?.rtl && css`
    margin-left: 20px;
    margin-right: 0;
  `}
  margin-bottom: 12px;
`

export const DTWrapperInput = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`
