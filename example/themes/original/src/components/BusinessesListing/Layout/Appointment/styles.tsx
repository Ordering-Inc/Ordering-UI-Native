import styled from 'styled-components/native'

export const WelcomeTitle = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`

export const BusinessList = styled.View`
  flex-wrap: wrap;
`

export const Search = styled.View`
  justify-content: flex-end;
  align-items: center;
  margin-vertical: 10px;
`

export const AddressInput = styled.TouchableOpacity`
  flex-direction: row;
  background-color: ${(props: any) => props.theme.colors.white};
  border-radius: 22px;
  padding-horizontal: 20px;
  align-items: center;
  width: 100%;
  height: 44px;
  max-height: 44px;
`

export const OrderControlContainer = styled.View`
  width: 100%;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  padding-bottom: 20px;
  flex: 1;
`

export const WrapMomentOption = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  border-radius: 7.6px;
  font-size: 12px;
  max-width: 240px;
  height: 26px;
  width: 130px;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 8px;
  flex-direction: row;
  margin-end: 12px;
`

export const HeaderWrapper = styled.ImageBackground`
	width: 100%;
	height: 370px;
  max-height: 370px;
	padding: 20px;
	background-color: transparent;
`;

export const ListWrapper = styled.View`
	background-color: ${(props: any) => props.theme.colors.backgroundLight};
	padding-horizontal: 20px;
`;

export const FeaturedWrapper = styled.View`
	background-color: ${(props: any) => props.theme.colors.backgroundLight};
	height: 220px;
	paddingVertical: 30px;
`;

export const OrderProgressWrapper = styled.View`
  margin-top: 37px;
  margin-bottom: 20px;
	padding-horizontal: 20px;
`

export const FarAwayMessage = styled.View`
  flex-direction: row;
  align-items: center;
	background-color: ${(props: any) => props.theme.colors.warning1};
  margin-bottom: 25px;
  border-radius: 7.6px;
  border: 1px solid ${(props: any) => props.theme.colors.warning5};
`

export const SearchBarWrapper = styled.View`
  width: 130px;
`

export const MomentWrapper = styled.View`
  width: 100%;
  margin-bottom: 20px;
`

export const FilterWrapper = styled.View`
  margin-top: 25px;
`

export const ServiceWrapper = styled.View`
  padding-horizontal: 20px;
`

export const PriceWrapper = styled.View`
  padding-horizontal: 20px;
  margin-top: 30px;
`
