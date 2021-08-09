import styled from 'styled-components/native'

export const Container = styled.View`
  margin: 20px 0;
`
export const UpsellingContainer = styled.ScrollView`
  
`
export const Item = styled.TouchableOpacity`
  padding: 20px 15px 15px;
  width: 50%;
`
export const Details = styled.View`
  justify-content: center;
  margin: 15px 0 10px 0;
`
export const AddButton = styled.TouchableOpacity`
	position: absolute;
	top: 0;
	end: 10px;
`
export const CloseUpselling = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${(props: any) => props.theme.colors.backgroundTab};
  padding: 12px 40px;
  border-top-width: 1px;
  border-top-color: ${(props: any) => props.theme.colors.border}
`
