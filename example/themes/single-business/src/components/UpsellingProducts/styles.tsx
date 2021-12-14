import styled from 'styled-components/native'

export const Container = styled.View`
  /* margin: 20px 0; */
`
export const UpsellingContainer = styled.ScrollView`
  max-height: 220px;
`
export const Item = styled.View`
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  border-radius: 10px;
  flex-direction: row;
  width: 250px;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-right: 15px;
`
export const Details = styled.View`
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  max-width: 69%;
`
export const AddButton = styled.TouchableOpacity`
  margin-top: 7px;
`
export const CloseUpselling = styled.View`
  margin-vertical: 10px;
  width: 100%;
`

export const WrapperAdd = styled.View`
  padding: 6px 20px;
  border-radius: 50px;
  background-color: ${(props: any) => props.theme.colors.primaryContrast};
`

export const WrapPrice = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
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
