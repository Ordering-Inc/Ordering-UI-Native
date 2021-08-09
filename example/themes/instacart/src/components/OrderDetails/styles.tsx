import styled from 'styled-components/native'

export const OrderDetailsContainer = styled.ScrollView``

export const NavBack = styled.TouchableOpacity``

export const Header = styled.View`
  padding: 20px 80px 20px 40px;
  background-color: ${(props: any) => props.theme.colors.white};
  flex-direction: row;
  flex: 1;
  max-height: 62px;
`

export const Logo = styled.View`
  border-radius: 40px;
  overflow: hidden;
  width: 65px;
  height: 65px;
  align-items: center;
  justify-content: center;
  background-color: ${(props: any) => props.theme.colors.white};
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
  background-color: ${(props: any) => props.theme.colors.whiteGray};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
export const Icons = styled.View`
  position: absolute;
  end: 40px;
  top: 20px;
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

export const StatusBar = styled.View`
	width: 100%;
	padding-vertical: 15px;
`

export const StatusImage = styled.View``

export const SectionTitle = styled.View``

export const OrderCustomer = styled.View`
  padding: 20px 40px 29px;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const OrderDriver = styled.View`
	padding-vertical: 13px;
	border-top-width: 1px;
	border-top-color: ${(props: any) => props.theme.colors.border};
`

export const Customer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  padding-vertical: 15px;
`
export const ShareDelivery = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 11px 15px;
  border: 1px solid ${(props: any) => props.theme.colors.border};
  border-radius: 3px;
`

export const CustomerPhoto = styled.View`
  margin-right: 20px;
`

export const InfoBlock = styled.View`
  margin-start: 15px;
`

export const HeaderInfo = styled.View`
  position: relative;
  background-color: ${(props: any) => props.theme.colors.primary};
  align-items: center;
  padding-horizontal: 40px;
  padding-vertical: 17px;
`

export const OrderProducts = styled(OrderCustomer)`
	padding-bottom: 0px;
`

export const Table = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  align-items: center;
  margin-top: 12px;
`

export const OrderBill = styled.View`
  padding-horizontal: 40px;
  padding-bottom: 20px;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const Total = styled.View`
  border-top-width: 1px;
  border-top-color: #d9d9d9;
  padding-vertical: 10px;
`

export const Map = styled.View`
  width: 100%;
  height: 110px;
  margin-top: 10px;
  border-radius: 3px
`
export const DivideView = styled.View`
	height: 16px;
	width: 100%;
	background-color: ${(props: any) => props.theme.colors.backgroundGray};
`;