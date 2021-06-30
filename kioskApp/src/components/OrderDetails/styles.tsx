import styled from 'styled-components/native'
import { colors } from '../../theme.json'

export const OSOrderDetailsWrapper = styled.View`
	background-color: ${colors.whiteGray}
	padding: 20px;
	border-radius: 6px;
`

export const OSTable = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
`

export const OSActions = styled.View`
  position: relative;
  bottom: 0px;
  width: 100%;
  background-color: #FFF;
	z-index: 1000;
	padding: 20px;
`

export const OSInputWrapper = styled.View`
	width: 100%;
	min-height: 150px;
  background-color: #FFF;
`
