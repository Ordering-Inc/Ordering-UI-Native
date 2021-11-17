import styled, { css } from 'styled-components/native';

export const CContainer = styled.View`
  /* border-bottom: 1px solid #F0F0F0; */
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

export const TotalCont = styled.View`
  position: absolute;
  end: 10px;
  top: 10px;
  background-color: rgba(0,0,0, 0.16);
  align-items: center;
  justify-content: center;
  padding: 6px 7px;
  border-radius: 4px;
`
