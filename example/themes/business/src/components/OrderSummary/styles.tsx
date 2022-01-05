import styled from 'styled-components/native';

export const Content = styled.ScrollView`
  background-color: ${(props: any) => props.theme.colors.white};
  flex: 1;
  margin-bottom: 60px;
  padding-horizontal: 20px;
`;

export const OrderContent = styled.View``;

export const OrderHeader = styled.View`
  background-color: ${(props: any) => props.theme.colors.white};
  border-bottom-width: 5px;
  border-bottom-color: ${(props: any) => props.theme.colors.inputChat};
`;

export const OrderBusiness = styled.View`
  border-bottom-width: 10px;
  border-bottom-color: ${(props: any) => props.theme.colors.inputChat};
`;

export const OrderCustomer = styled.View`
  border-bottom-width: 10px;
  border-bottom-color: ${(props: any) => props.theme.colors.inputChat};
`;

export const OrderProducts = styled.View`
  border-bottom-width: 10px;
  border-bottom-color: ${(props: any) => props.theme.colors.inputChat};
`;

export const Table = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  align-items: center;
`;

export const OrderBill = styled.View`
  flex: 1;
`;

export const Total = styled.View`
  border-top-width: 1px;
  border-top-color: ${(props: any) => props.theme.colors.borderTops};
  padding-vertical: 10px;
`;

export const ContentInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
  width: 100%;
`;

export const Action = styled.View`
  margin-horizontal: 30px;
  padding-top: 10px;
`;
