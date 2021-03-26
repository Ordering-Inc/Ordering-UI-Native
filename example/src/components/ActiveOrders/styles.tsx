import styled from 'styled-components/native'
import { colors } from '../../theme'

export const ActiveOrdersContainer = styled.ScrollView`
  margin-bottom: 20px;
  height: 130px;
  max-height: 150px;
`

export const Card = styled.TouchableOpacity`
  flex: 1;
  border: 1px solid ${colors.primary};
  border-radius: 20px;
  margin-right: 10px;
  min-width: 340px;
  height: 100px
`

export const Map = styled.View`
  flex: 1;
  height: 125px
`

export const Information = styled.View`
  flex-direction: row;
  flex: 1;
  height: 100px;
  align-items: center;
  padding: 10px
`

export const Logo = styled.View`
`

export const OrderInformation = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  padding-left: 10px;
  
`

export const BusinessInformation = styled.View`
  
`

export const Price = styled.View`
  justify-content: space-between;
  align-items: flex-end;
  margin-left: 10px
`
