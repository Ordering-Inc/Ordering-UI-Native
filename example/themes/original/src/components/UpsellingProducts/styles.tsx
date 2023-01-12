import styled from 'styled-components/native'

export const Container = styled.View`
  margin: 20px 0;
  margin-start: -40px;
  margin-end: -40px;
`
export const UpsellingContainer = styled.ScrollView`
  max-height: 92px;
`
export const Item = styled.View`
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  border-radius: 7.6px;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10px;
  margin-right: 12px;
  min-width: 207px;
  max-width: 207px;
  width: 207px;
`
export const Details = styled.View`
  align-items: flex-start;
  justify-content: center;
`
export const AddButton = styled.TouchableOpacity`
	padding: 4px 8px;
	background-color: ${(props: any) => props.theme.colors.primaryContrast};
	border-radius: 30px;
	width: 40%;
	align-items: center;
	margin-top: 6px;
`
export const CloseUpselling = styled.View`
  margin-vertical: 10px;
  width: 100%;
`
export const TopBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 50px;
  padding-horizontal: 40px;
`
export const TopActions = styled.TouchableOpacity`
	height: 44px;
	justify-content: center;
`;

export const CartList = styled.ScrollView`
  padding: 10px 40px;
  overflow: visible;
`

export const CartDivider = styled.View`
  height: 8px;
  background-color:  ${(props: any) => props.theme.colors.backgroundGray100};
  margin: 20px -40px 0;
`
