import styled, { css } from 'styled-components/native';

export const CContainer = styled.View`
  /* border-bottom: 1px solid #F0F0F0; */
`

export const CartContent = styled.View`
  ${((props: any) => props.isBusinessCart && css`
    margin-bottom: 65px;
  `)}
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
