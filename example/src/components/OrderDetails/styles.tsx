import styled from 'styled-components/native'
import { colors } from '../../theme'

export const OrderDetailsContainer = styled.ScrollView`
  
`

export const NavBack = styled.TouchableOpacity`

`


export const Header = styled.View`
  padding: 20px;
  background-color: ${colors.primary};
  flex: 1;
`

export const Logo = styled.View`
  margin-right: 20px;
`

export const OrderContent = styled.View`
`

export const OrderBusiness = styled.View`
  position: relative; 
  bottom: 10px;
  padding-vertical: 10px;
  padding-horizontal: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: ${colors.whiteGray};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
export const Icons = styled.View`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const OrderInfo = styled.View`
  padding: 20px;
  flex: 1;
`

export const OrderData = styled.View`
  flex: 1;
`


export const OrderStatus = styled.View`
  padding: 20px;
  align-items: center;
  width: 35%;
  flex-wrap: wrap;
`

export const StaturBar = styled.View`
`

export const StatusImage = styled.View`
  
`

export const SectionTitle = styled.View`
  
`

export const OrderCustomer = styled.View`
  padding: 20px;
  background-color: ${colors.white};
`

export const OrderDriver = styled(OrderCustomer)``

export const Customer = styled.View`
  flex-direction: row;
  align-items: center;
`

export const CustomerPhoto = styled.View`
  margin-right: 20px;
`

export const InfoBlock = styled.View`
  width: 70%;
`

export const HeaderInfo = styled.View`
  flex: 1;
  width: 80%;
`

export const OrderProducts = styled(OrderCustomer)``

export const Table = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  align-items: center;
`

export const OrderBill = styled.View`
  padding-horizontal: 30px;
  padding-vertical: 10px;
  flex: 1;
  background-color: ${colors.white}
`

export const Total = styled.View`
  border-top-width: 1px;
  border-top-color: #d9d9d9;
  padding-vertical: 10px
`
