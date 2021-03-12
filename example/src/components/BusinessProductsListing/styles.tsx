import styled from 'styled-components/native'
import { colors } from '../../theme'

export const WrapHeader = styled.View`
  position: relative;
`
export const TopHeader = styled.View`
  position: absolute;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
`
export const AddressInput = styled.TouchableOpacity`
`
export const WrapSearchBar = styled.View`
  padding: 5px;
  background-color: ${colors.white};
  flex: 1;
`
export const WrapContent = styled.View`
  padding: 10px 20px;
`
