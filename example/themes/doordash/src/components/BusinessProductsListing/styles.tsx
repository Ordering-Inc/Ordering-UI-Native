import styled, { css } from 'styled-components/native'

export const WrapHeader = styled.View`
	min-height: 220px;
	max-height: 220px;
`;
export const TopHeader = styled.View`
	width: 100%;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	z-index: 1;
	flex: 1;
	padding-horizontal: 40px;
	min-height: 60px;
	margin-bottom: 10px;
	overflow: visible;
`;
export const AddressInput = styled.TouchableOpacity`
	flex: 1;
	background-color: rgba(0,0,0,0.3);
	padding: 15px;
	border-radius: 24px;
	`
export const WrapSearchBar = styled.View`
   position: relative; 
	background-color: ${(props: any) => props.theme.colors.inputDisabled};
  	flex: 1;
	border-radius: 25px;
	height: 40px;
	margin-end: 20px;
`
export const WrapContent = styled.View`
  	padding: 10px 40px;
`

export const BusinessProductsListingContainer = styled.ScrollView`
  flex: 1;
`
export const SortWrap = styled.View`
	flex-direction: row;
	align-items: center;
	min-width: 100px;
`;
export const SortButton = styled.TouchableOpacity`
	background-color: ${(props: any) => props.theme.colors.backgroundGray300};
	height: 34px;
	padding-horizontal: 16px;
	border-radius: 30px;
	align-items: center;
	justify-content: center;
`;
export const CategoryWrap = styled.View`
	background-color: ${(props: any) => props.theme.colors.white};
	min-height: 43px;
	max-height: 43px;
`;

export const CategoryWrapInner = styled.View`
	min-height: 43px;
	max-height: 43px;
`;