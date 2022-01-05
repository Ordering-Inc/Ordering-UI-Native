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
  flex-direction: row;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  margin-vertical: 10px;
`

export const AddressInput = styled.TouchableOpacity`
  align-items: center;
  padding-horizontal: 20px;
  flex: 1;
  width: 100%;
  z-index: -10;
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
  background-color: ${(props: any) => props.theme.colors.inputDisabled};
  border-radius: 10px;
  margin-vertical: 5px;
  padding: 15px 20px;
  max-width: 240px;
`

export const HeaderCont = styled.View`
	flex-direction: row;
	height: 60px;
	min-height: 60px;
	align-items: center;
`;

export const FeaturedBussiCont = styled.ScrollView`
	min-height: 190px;
	margin-horizontal: -40px;
`;