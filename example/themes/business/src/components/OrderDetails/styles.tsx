import styled, { css } from 'styled-components/native';

export const OrderDetailsContainer = styled.ScrollView`
  flex: 1;
`;

export const Pickup = styled.View`
  padding-vertical: 20px;
  margin-bottom: 20px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const Actions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

export const Logo = styled.View`
  margin-right: 20px;
`;

export const OrderContent = styled.View`
  flex: 1;
  ${(props: any) => props.isOrderGroup && css`
    border-color: rgba(0, 0, 0, 0.2);
    border-width: 1px;
    padding: 10px;
  `
  }
  ${(props: any) => props.lastOrder && css`
    margin-bottom: 50px;
  `}
`;

export const OrderHeader = styled.View`
  padding-top: 20px;
  padding-bottom: 10px;
`;

export const OrderBusiness = styled.View`
  position: relative;
  bottom: 20px;
  padding-vertical: 20px;
  flex-direction: column;
  border-bottom-width: 10px;
  border-bottom-color: ${(props: any) => props.theme.colors.inputChat};
  align-items: flex-start;
`;

export const OrderCustomer = styled.View`
  border-bottom-width: 10px;
  border-bottom-color: ${(props: any) => props.theme.colors.inputChat};
  padding-vertical: 10px;
`;

export const OrderProducts = styled(OrderCustomer)``;

export const Table = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  align-items: center;
`;

export const OrderBill = styled.View`
  padding-vertical: 20px;
  ${(props: any) => !props.vehicleExists && css`
    padding-bottom: 50px;
  `
  }
  flex: 1;
`;

export const OrderVehicle = styled.View`
  border-top-width: 1px;
  border-top-color: ${(props: any) => props.theme.colors.borderTops};
  padding-vertical: 20px;
  padding-bottom: 50px;
  flex: 1;
`;

export const OrderSpot = styled.View`
  border-top-width: 1px;
  border-top-color: ${(props: any) => props.theme.colors.borderTops};
  padding-vertical: 20px;
  ${(props: any) => !props.vehicleExists && css`
    padding-bottom: 50px;
  `}
  flex: 1;
`;

export const Total = styled.View`
  border-top-width: 1px;
  border-top-color: ${(props: any) => props.theme.colors.borderTops};
  padding-vertical: 10px;
`;

export const DriverItem = styled.View`
  padding: 15px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  justify-content: ${(props: any) =>
    props?.justifyContent ? props?.justifyContent : 'flex-start'};
`;

export const AssignDriver = styled.View`
  padding-vertical: 10px;
  margin-bottom: 10px;
`;

export const OSRow = styled.View`
  flex-direction: row;
  overflow: hidden;
  width: 70%;
  flex-wrap: wrap;
`

export const Messages = styled.View`
position: relative;
`;

export const Dot = styled.View`
position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(props: any) => props.theme.colors.red};
  top: 10px;
  right: 10px;
  z-index: 99;
`;
