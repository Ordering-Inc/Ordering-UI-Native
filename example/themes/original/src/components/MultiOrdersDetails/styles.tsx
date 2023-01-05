import styled from 'styled-components/native'

export const OrdersDetailsContainer = styled.ScrollView`  
`
export const Header = styled.View`
  padding: 10px 0 24px 0;
`
export const Divider = styled.View`
  height: 8px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  margin-horizontal: -40px;
`
export const Section = styled.View`
  padding: 24px 0px;
`
export const Customer = styled.View`
  flex-direction: row;
  align-items: center;
`
export const InfoBlock = styled.View`
  width: 100%;
`
export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  align-items: center;
  padding-bottom: 10px;
`
export const OrdersSummary = styled.View`
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  margin-horizontal: -40px;
  padding: 25px 40px;
`
export const BorderLine = styled.View`
  height: 1px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray200};
  margin-vertical: 6px;
`
export const SingleOrderContainer = styled.View`
  padding: 40px 0;
`
export const StaturBar = styled.View`
	margin-top: ${(props: any) => props.isOrderDetails ? '10px' : '30px'};
	margin-bottom: 10px;
`
export const Icons = styled.View`
  flex-direction: row;
  align-items: center;
`
