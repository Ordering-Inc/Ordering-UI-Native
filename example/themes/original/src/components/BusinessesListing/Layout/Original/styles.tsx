import styled, { css } from 'styled-components/native'

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
  margin-horizontal: 20px;
  ${(props: any) => props.isChewLayout && css`
    margin-horizontal: 30px;
  `}
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
  ${(props: any) => props.isChewLayout && css`
    border-radius: 8px;
  `}
`

export const OrderControlContainer = styled.View`
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
  padding-bottom: 20px;
  flex: 1;
`

export const WrapMomentOption = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.white};
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
  height: 270px;
	padding: 20px;
	background-color: transparent;
`;

export const ListWrapper = styled.View`
	background-color: ${(props: any) => props.theme.colors.backgroundLight};
`;

export const FeaturedWrapper = styled.View`
	background-color: ${(props: any) => props.theme.colors.backgroundLight};
	paddingVertical: 30px;
`;

export const FarAwayMessage = styled.View`
  flex-direction: row;
  align-items: center;
	background-color: ${(props: any) => props.theme.colors.warning1};
  margin-bottom: 10px;
  border-radius: 7.6px;
  border: 1px solid ${(props: any) => props.theme.colors.warning5};
`

export const AddressInputContainer = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
  ${(props: any) => props.isChewLayout && css`
    flex-direction: row-reverse;
  `}
`

export const PreorderInput = styled(AddressInput)`
  justify-content: center;
`

export const OTabs = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: -1px;
  width: 100%;
`;

export const OTab = styled.TouchableOpacity`
  padding-bottom: 10px;
  border-bottom-width: 1px;
  margin-end: 14px;
  padding-horizontal: 5px;
`;

export const OrderTypesContainer = styled.View`
  flex-direction: row;
  font-size: 14px;
  width: 180px;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
  margin-top: 10px;
  align-self: center;
`

export const BusinessLogosContainer = styled.ScrollView`
  padding-bottom: 10px;
`
