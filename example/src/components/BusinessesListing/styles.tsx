import styled from 'styled-components/native'
import {colors} from '../../theme'

export const WelcomeTitle = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`

export const BusinessList = styled.View`
  flex-wrap: wrap;
`

export const Search = styled.View`
  flex-direction: row;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  margin-vertical: 10px;
`

export const AddressInput = styled.TouchableOpacity`
  flex-direction: row;
  background-color: ${colors.inputDisabled};
  border-radius: 10px;
  align-items: center;
  margin-horizontal: 10px;
  padding: 15px;
  flex: 1;
  width: 100%;
`

export const OrderControlContainer = styled.View`
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
  padding-bottom: 20px;
  flex: 1;
`

export const WrapMomentOption = styled.TouchableOpacity`
  background-color: ${colors.inputDisabled};
  border-radius: 10px;
  margin-vertical: 5px;
  padding: 15px 20px;
  max-width: 240px;
`
