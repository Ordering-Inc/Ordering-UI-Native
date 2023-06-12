import styled from 'styled-components/native'

export const OrderDetailsContainer = styled.ScrollView`
  
`

export const NavBack = styled.TouchableOpacity`
`


export const Header = styled.View`
  padding: 10px 20px;
  flex: 1;
`

export const Logo = styled.View`
  margin-right: 20px;
`

export const OrderContent = styled.View`
`

export const OrderBusiness = styled.View`
  position: relative; 
  padding-vertical: 10px;
  padding-horizontal: 20px;
  background-color: ${(props: any) => props.theme.colors.white};
  align-items: flex-start;
`
export const Icons = styled.View`
  flex-direction: row;
  align-items: center;
`

export const OrderInfo = styled.View`
  padding: 10px 0;
  flex: 1;
`

export const OrderData = styled.View`
  
`


export const OrderStatus = styled.View`
  padding: 20px;
  align-items: center;
  width: 35%;
  flex-wrap: wrap;
`

export const StaturBar = styled.View`
	margin-top: 30px;
	margin-bottom: 18px;
`

export const StatusImage = styled.View`
  
`

export const SectionTitle = styled.View`
  
`

export const OrderCustomer = styled.View`
  padding: 20px 20px 10px;
  background-color: ${(props: any) => props.theme.colors.white};
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
  width: 100%;
`

export const HeaderInfo = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  padding: 20px 20px;
`

export const OrderProducts = styled(OrderCustomer)``

export const Table = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  align-items: center;
  padding-bottom: 10px;
`

export const OrderBill = styled.View`
  padding-horizontal: 20px;
  padding-vertical: 10px;
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const Total = styled.View`
  border-top-width: 1px;
  border-top-color: ${(props: any) => props.theme.colors.border};
  padding-vertical: 10px;
`

export const Map = styled.View`
  width: 100%;
  height: 250px;
  margin-top: 20px;
  border-radius: 20px;
`

export const Divider = styled.View`
  border-color: #EAEAEA;
  border-width: 1px;
  margin-top: 5px;
  margin-bottom: 5px;
`
export const OrderAction = styled.View`
  flex-direction: row;
`

export const PlaceSpotWrapper = styled.View`
  padding-horizontal: 20px;
`

export const ProfessionalPhoto = styled.ImageBackground`
  width: 100%;
  position: relative;
  max-height: 80px;
  height: 80px;
  width: 80px;
  resize-mode: cover;
  margin-right: 10px;
`;

export const TopActions = styled.TouchableOpacity`
	height: 60px;
	justify-content: center;
  min-width: 30px;
  padding-right: 15px;
`;

export const TopHeader = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  height: 60px;
  min-height: 60px;
`
