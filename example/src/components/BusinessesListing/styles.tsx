import styled from 'styled-components/native'
import {colors} from '../../theme'

export const WelcomeTitle = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center
`

export const BusinessList = styled.View`
  flex-wrap: wrap;
`

export const Search = styled.View`
  align-items: flex-end;
  margin-bottom: 20px
`

export const AddressInput = styled.TouchableOpacity`
  flex-direction: row;
  background-color: ${colors.backgroundGray};
  border-radius: 10px;
  align-items: center;
  margin-vertical: 10px;
  padding: 10px;
`