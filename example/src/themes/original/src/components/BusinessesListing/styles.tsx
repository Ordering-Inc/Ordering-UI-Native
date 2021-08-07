import styled from 'styled-components/native'
import { colors } from '../../theme.json'

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
  background-color: ${colors.white};
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
  flex: 1;
`

export const WrapMomentOption = styled.TouchableOpacity`
  background-color: ${colors.backgroundGray100};
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
	height: 370px;
	padding: 20px 40px;
	background-color: transparent;
`;

export const ListWrapper = styled.View`
	background-color: ${colors.backgroundLight};
	padding-horizontal: 40px;
`;

export const FeaturedWrapper = styled.View`
	background-color: ${colors.backgroundLight};
	height: 220px;
	paddingVertical: 30px;
`;