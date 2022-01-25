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
  align-items: center;
  justify-content: flex-start;
  background-color: white;
  padding-horizontal: 15px;
  border-radius: 8px;
  height: 44px;
  min-height: 44px;
`

export const OrderControlContainer = styled.View`
  width: 100%;
  z-index: 10;
  padding-top: 20px;
  flex: 1;
`

export const WrapMomentOption = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  border-radius: 7.6px;
  font-size: 12px;
  max-width: 240px;
  height: 26px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 8px;
  flex-direction: row;
  margin-end: 12px;
`

export const HeaderWrapper = styled.ImageBackground`
	width: 100%;
	height: 200px;
	padding: 0px 40px 20px;
	background-color: transparent;
`;

export const ListWrapper = styled.View`
	background-color: ${(props: any) => props.theme.colors.backgroundLight};
	padding-horizontal: 40px;
`;

export const FeaturedWrapper = styled.View`
	background-color: ${(props: any) => props.theme.colors.backgroundLight};
	max-height: 220px;
	paddingVertical: 20px;
`;

export const TopHeader = styled.View`
  position: absolute;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  height: 34px;
  min-height: 34px;
`

export const DropOptionButton = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  border-radius: 7.6px;
  font-size: 12px;
  max-width: 240px;
  height: 26px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 8px;
  flex-direction: row;
  margin-end: 12px;
`

export const WrapSearchBar = styled.View`
  padding: 10px 30px;
  margin-bottom: 10px;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const FarAwayMessage = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
	background-color: ${(props: any) => props.theme.colors.warning1};
  border-radius: 8px;
  border: 1px solid ${(props: any) => props.theme.colors.warning5};
  width: 100%;
  padding: 6px 20px;
  margin-top: 20px;
`
