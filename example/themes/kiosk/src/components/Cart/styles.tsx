import styled, { css } from 'styled-components/native';

export const CContainer = styled.View`
  padding: 0 20px;
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

export const Actions = styled.View`
  position: relative;
  bottom: 0px;
  width: 100%;
  background-color: #FFF;
  z-index: 1000;
`

export const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
  padding-bottom: 15px;
`;

export const OrderTypeWrapper = styled.View`
  background-color: ${(props: any) => props.theme.colors.white};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-bottom-color: #E1E8ED;
  border-bottom-width: 1px;
  margin-bottom: 30px;
`;

export const FloatingLayout = styled.View`
  position: absolute;
  flex: 1;
  bottom: 0px;
  left: 0;
  padding: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFF;
  z-index: 1000;

  ${((props: any) => props.isIos && css`
    padding-bottom: 20px;
  `)}
`
