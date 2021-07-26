import styled from 'styled-components/native'

export const BusinessContainer = styled.View`
 
`
export const BusinessHeader = styled.ImageBackground`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 260px;
  resize-mode: cover;
  min-height: 200px;
  padding-horizontal: 40px;
  justify-content: flex-end;
  padding-bottom: 12px;
`
export const BusinessLogo = styled.View`
	align-self: center;
`
export const BusinessInfo = styled.View`
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`
export const BusinessInfoItem = styled.View`
	padding-vertical: 12px;
  flex-direction: row;
  align-items: center;
`
export const WrapReviews = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
export const WrapBusinessInfo = styled.TouchableOpacity`
  margin-horizontal: 10px;
`
export const WrapSearch = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.white};
  flex: 1;
  max-height: 42px;
  border: 1px solid ${(props: any) => props.theme.colors.border};
  border-radius: 3px;
  padding-horizontal: 10px;
`
