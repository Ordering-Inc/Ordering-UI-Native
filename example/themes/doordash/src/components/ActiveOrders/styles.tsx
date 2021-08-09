import styled from 'styled-components/native'
import { colors } from '../../theme.json'

export const ActiveOrdersContainer = styled.ScrollView`
  margin-bottom: 20px;
  height: 150px;
  max-height: 150px;
`

export const Card = styled.TouchableOpacity`
  flex: 1;
  border: 1px solid ${colors.primary};
  border-radius: 2px;
  margin-right: 10px;
  height: 97px;
`

export const Map = styled.View`
  flex: 1;
  height: 125px;
  margin-bottom: 10px
`

export const Information = styled.View`
  flex: 1;
  padding: 10px 15px;
`

export const Logo = styled.View`
`

export const OrderInformation = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
`

export const BusinessInformation = styled.View`
`

export const Price = styled.View`
  align-items: flex-end;
  width: 30%;
`
