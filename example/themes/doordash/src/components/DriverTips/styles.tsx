import styled, { css } from 'styled-components/native'
import { colors } from '../../theme.json'

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
  padding: 10px;
  border: 1px solid ${colors.primary};
  text-transform: capitalize;
  min-height: 60px;
  min-width: 60px;
  margin-right: 10px;
  margin-top: 10px;

  ${(props: any) => props.isActive && css`
    background-color: ${colors.primary};
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
