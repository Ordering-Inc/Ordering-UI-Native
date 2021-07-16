import styled from 'styled-components/native'
import { colors } from '../../theme.json'

export const CardContainer = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 10px;
  position: relative;
`
export const CardInfo = styled.View`
  padding-start: 3px;
  flex: 1;
`
export const SoldOut = styled.View`
  position: absolute;
  background: ${colors.backgroundGray100} 0% 0% no-repeat padding-box;
  border-radius: 23px;
  padding: 5px 10px;
  top: 37px;
  end: 10px;
`
