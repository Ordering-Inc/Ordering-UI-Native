import styled, { css } from 'styled-components/native'

export const DTContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
`

export const DTWrapperTips = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
`

export const DTCard = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props: any) => props.isActive ? props.theme.colors.primary : props.theme.colors.border};
  text-transform: capitalize;
  min-height: 55px;
  min-width: 55px;
  max-width: 80px;
  max-height: 55px;
  margin-right: 10px;
  margin-left: 10px;
  margin-top: 10px;
  padding-horizontal: 10px;

  ${(props: any) => props.isActive && css`
    background-color: ${(props: any) => props.theme.colors.primary};
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
  font-size: 14px;
  align-self: flex-start;
  color: ${(props: any) => props.theme.colors.textSecondary};
  margin-top: 10px;

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
