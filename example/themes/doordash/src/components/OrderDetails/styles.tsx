import styled from 'styled-components/native'

export const OrderDetailsContainer = styled.ScrollView`
  
`

export const NavBack = styled.TouchableOpacity`

`

export const Header = styled.View`
	flex: 1;
  padding: 20px 0;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
`

export const Logo = styled.View`
  margin-right: 20px;
`

export const OrderContent = styled.View`
`

export const OrderBusiness = styled.View`
  position: relative; 
  padding-vertical: 10px;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
`
export const Icons = styled.View`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const OrderInfo = styled.View`
  padding: 10px 0px;
  flex: 1;
`

export const OrderData = styled.View`
  flex: 1;
`


export const OrderStatus = styled.View`
  padding: 20px 0;
  align-items: center;
  width: 35%;
  flex-wrap: wrap;
`

export const StatusBar = styled.View`
`

export const StatusImage = styled.View`
  
`

export const SectionTitle = styled.View`
  
`

export const OrderCustomer = styled.View`
  padding: 20px 0;
  background-color: ${(props: any) => props.theme.colors.white};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
`

export const OrderDriver = styled(OrderCustomer)``

export const Customer = styled.View`
  flex-direction: column;
  align-items: flex-start;
`

export const CustomerPhoto = styled.View`
  margin-right: 20px;
`

export const InfoBlock = styled.View`
  width: 100%;
`

export const HeaderInfo = styled.View`
  flex: 1;
  align-items: flex-start;
  width: 80%;
`

export const OrderProducts = styled(OrderCustomer)`
	border-bottom-width: 0;
`

export const Table = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  align-items: center;
  padding-vertical: 2px;
`

export const OrderBill = styled.View`
  padding-vertical: 10px;
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.white}
`

export const Total = styled.View`
  border-top-width: 1px;
  border-top-color: #d9d9d9;
  padding-vertical: 10px;
  margin-top: 20px;
  flex: 1;
`

export const Map = styled.View`
  width: 100%;
  height: 111px;
  margin-top: 10px;
  border-radius: 7.6px;
  overflow: hidden;
`
