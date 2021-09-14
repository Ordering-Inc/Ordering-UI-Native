import styled from 'styled-components/native';

export const OrderDetailsContainer = styled.ScrollView`
  flex: 1;
  padding-horizontal: 20px;
  margin-bottom: 50px;
`;

export const Pickup = styled.View`
  padding-vertical: 10px;
  margin-bottom: 20px;
`;

export const NavBack = styled.TouchableOpacity``;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-top: 10px;
  padding-horizontal: 20px;
`;

export const DriverItem = styled.View`
  padding: 15px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  justify-content: ${(props: any) =>
    props?.justifyContent ? props?.justifyContent : 'flex-start'};
`;

export const Actions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

export const Logo = styled.View`
  margin-right: 20px;
`;

export const OrderContent = styled.View``;

export const OrderHeader = styled.View`
  padding-vertical: 10px;
  border-bottom-width: 10px;
  border-bottom-color: ${(props: any) => props.theme.colors.inputChat};
  padding-horizontal: 20px;
`;

export const OrderBusiness = styled.View`
  position: relative;
  bottom: 10px;
  padding-vertical: 10px;
  flex-direction: column;
  align-items: flex-start;
`;
export const Icons = styled.View`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const OrderInfo = styled.View`
  padding: 20px;
  flex: 1;
`;

export const OrderData = styled.View`
  flex: 1;
`;

export const OrderStatus = styled.View`
  padding: 20px;
  align-items: center;
  width: 35%;
  flex-wrap: wrap;
`;

export const StaturBar = styled.View``;

export const StatusImage = styled.View``;

export const SectionTitle = styled.View``;

export const OrderCustomer = styled.View`
  padding-vertical: 10px;
  border-bottom-width: 10px;
  border-bottom-color: ${(props: any) => props.theme.colors.inputChat};
`;

export const OrderDriver = styled(OrderCustomer)``;

export const Customer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CustomerPhoto = styled.View`
  margin-right: 20px;
`;

export const InfoBlock = styled.View`
  width: 70%;
`;

export const HeaderInfo = styled.View`
  flex: 1;
  width: 80%;
`;

export const OrderProducts = styled(OrderCustomer)``;

export const Table = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  align-items: center;
`;

export const OrderBill = styled.View`
  padding-vertical: 10px;
  flex: 1;
`;

export const Total = styled.View`
  border-top-width: 1px;
  border-top-color: ${(props: any) => props.theme.colors.borderTops};
  padding-vertical: 10px;
`;

export const Map = styled.View`
  width: 100%;
  height: 90%;
  margin-top: 20px;
  border-radius: 20px;
`;

export const AssignDriver = styled.View`
  padding-vertical: 10px;
  margin-bottom: 10px;
`;
