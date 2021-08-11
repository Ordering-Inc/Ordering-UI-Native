import styled from 'styled-components/native'
import { colors } from '../../theme.json'

export const CardContainer = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  position: relative;
  padding-start: 12px;
`
export const CardInfo = styled.View`
  padding-vertical: 12px;
  padding-end: 10px;
  flex: 1;
  align-items: flex-start;
`
export const SoldOut = styled.View`
  position: absolute;
  top: 13px;
  right: 22px;
`
