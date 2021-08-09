import styled, { css } from 'styled-components/native'

export const OrderDetailsContainer = styled.ScrollView`
  flex: 1;
  position: relative;
`

export const Header = styled.View`
  padding: 10px 20px;
  flex-direction: row;
  border-bottom-width: 3px;
  border-bottom-color: ${(props: any) => props.theme.colors.mediumGray};
  margin-bottom: 10px;
`

export const NavBack = styled.TouchableOpacity``

export const Logo = styled.View`
  margin-right: 20px;
`

export const OrderContent = styled.View`
  padding-horizontal: 20px;
`

export const OrderBusiness = styled.View`
  position: relative;
  padding-vertical: 10px;
  padding-horizontal: 20px;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: flex-start;
`
export const Icons = styled.View`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const OrderInfo = styled.View`
  padding: 0 20px;
  flex: 1;
`

export const OrderData = styled.View`
`

export const OrderStatus = styled.View`
  padding: 0 20px;
`

export const StatusBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`

export const WrapperStatusBarItem = styled.View`
  width: 30%;
  flex-direction: column;
  align-items: center;
`

export const StatusItem = styled.View`
  background-color: ${(props: any) => props.theme.colors.backgroundGray};
  ${(props: any) => props.active && css`
    background-color: ${(props: any) => props.theme.colors.green};
  `}
  width: 100%;
  height: 10px;
  margin-bottom: 5px;
`


export const StatusImage = styled.View``

export const SectionTitle = styled.View``

export const OrderCustomer = styled.View`
  padding-horizontal: 20px;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const OrderDriver = styled(OrderCustomer)`
  margin-top: 20px;
`

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
  align-items: flex-start;
  width: 80%;
`

export const OrderProducts = styled.View`
  margin-top: 20px;
  padding-horizontal: 20px;
`

export const Table = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  align-items: center;
`

export const OrderBill = styled.View`
  padding-horizontal: 20px;
  padding-vertical: 10px;
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const Total = styled.View`
  margin-top: 10px;
  border-top-width: 1px;
  border-top-color: #d9d9d9;
  padding-vertical: 10px;
`

export const Map = styled.View`
  width: 100%;
  height: 250px;
  margin-top: 20px;
  border-radius: 20px;
`
