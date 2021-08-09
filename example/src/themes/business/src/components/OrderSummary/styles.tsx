import styled from 'styled-components/native';

export const Content = styled.ScrollView`
  background-color: ${(props: any) => props.theme.colors.white};
  flex: 1;
  margin-bottom: 60px;
`;

export const OrderContent = styled.View``;

export const OrderHeader = styled.View`
  background-color: ${(props: any) => props.theme.colors.white};
  padding-horizontal: 40px;
  padding-vertical: 10px;
  border-bottom-width: 5px;
  border-bottom-color: ${(props: any) => props.theme.colors.inputChat};
`;

export const OrderBusiness = styled.View`
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  padding-horizontal: 40px;
  padding-vertical: 10px;
  border-bottom-width: 10px;
  border-bottom-color: ${(props: any) => props.theme.colors.inputChat};
`;

export const OrderCustomer = styled.View`
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  padding-horizontal: 40px;
  padding-vertical: 10px;
  border-bottom-width: 10px;
  border-bottom-color: ${(props: any) => props.theme.colors.inputChat};
`;

export const OrderProducts = styled.View`
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  padding-horizontal: 40px;
  padding-vertical: 10px;
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
  padding-horizontal: 40px;
  padding-vertical: 10px;
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  border-bottom-width: 10px;
  border-bottom-color: ${(props: any) => props.theme.colors.inputChat};
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
