import styled, { css } from 'styled-components/native';

export const CContainer = styled.View`
  /* border-bottom: 1px solid #F0F0F0; */
`

export const Title = styled.View`
  margin: 20px 0;
`

export const LineDivider = styled.View`
  height: 8px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
`

export const OrderBill = styled.View`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 10px;
  background-color: #FFF;
`

export const CouponContainer = styled.View`
  width: 100%;
  margin: 10px;
`

export const CheckoutAction = styled.View`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`

export const OSBill = styled.View`
  padding: 14px 0px 20px;
  border-top-width: 1px;
  border-top-color: ${(props: any) => props.theme.colors.border};
  margin-top: 20px;
`

export const OSTable = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 5px;
`

export const OSTotal = styled.View`
  border-top-width: 1px;
  border-top-color: #d9d9d9;
  margin-top: 15px;
`

export const OSCoupon = styled.View`
  width: 100%;
  padding: 5px 0px;
`
