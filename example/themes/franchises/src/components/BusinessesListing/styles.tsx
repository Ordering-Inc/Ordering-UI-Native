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

export const DistanceWarning = styled.View`
  border-radius: 7.6px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.warningDark};
  background-color: ${(props: any) => props.theme.colors.warning};
  padding: 2px 16px;
  margin-top: 11px;
  flex-direction: row;
  align-items: center;
  width: 100%;
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
  justify-content: space-between;
  z-index: 10;
  padding-bottom: 20px;
  margin-top: 12px;
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
  margin-end: 19px;
`

export const HeaderWrapper = styled.ImageBackground`
	width: 100%;
	height: 224px;
	padding: 20px 40px;
	background-color: transparent;
`;

export const HeaderContainer = styled.View`
  background-color: white;
`;
export const SearchWrap = styled.View`
  background-color: white;
  min-height: 80px;
  padding: 30px 40px 20px;
`;

export const ListWrapper = styled.View`
	background-color: ${(props: any) => props.theme.colors.backgroundLight};
	padding-horizontal: 40px;
  padding-top: 12px;
`;

export const FeaturedWrapper = styled.View`
	background-color: ${(props: any) => props.theme.colors.backgroundLight};
	paddingVertical: 24px;
`;