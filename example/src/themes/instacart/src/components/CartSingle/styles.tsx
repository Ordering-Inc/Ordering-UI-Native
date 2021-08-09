import styled, { css } from 'styled-components/native';

export const CContainer = styled.View`
  /* border-bottom: 1px solid #F0F0F0; */
  flex: 1;
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
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding-vertical: 12px;
  border-top-width: 1px;
  padding-horizontal: 40px;
  border-top-color: ${(props: any) => props?.theme?.colors.border}
`
export const ProductsScroll = styled.ScrollView`
	flex-grow: 1;
	margin-bottom: 65px;
`

export const HeaderNav = styled.View`
	min-height: 50px;
	height: 50px;
	width: 100%;
	flex-direction: row;
	align-items: center;
	padding-horizontal: 40px;
	border-bottom-width: 1px;
	border-bottom-color: ${(props: any) => props?.theme?.colors.border};
`

export const BusinessInfoView = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding-horizontal: 40px;
	padding-vertical: 10px;
	border-bottom-width: 1px;
	margin-horizontal: -40px;
	border-bottom-color: ${(props: any) => props?.theme?.colors.border};
`