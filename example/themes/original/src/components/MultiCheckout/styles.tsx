import styled from 'styled-components/native'

export const ChContainer = styled.View`
  margin-bottom: 60px;
`
export const ChSection = styled.View`
  padding-top: 30px;
`
export const ChHeader = styled.View`
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  margin: 0px;
`
export const CHMomentWrapper = styled.TouchableOpacity`
	background-color: ${(props: any) => props.isCustomColor
    ? props.theme.colors.primary
    : props.theme.colors.backgroundGray100};
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
export const ChUserDetails = styled.View`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding-bottom: 34px;
`
export const ChAddress = styled.View`
  width: 100%;
`
export const ChCarts = styled.View`
  display: flex;
  flex-direction: column;
  padding: 0 0 20px;
`
export const CartsHeader = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`
export const CCNotCarts = styled.View`
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80%;
  margin: auto;
`
export const ChCartsTotal = styled.View`
  margin-top: 16px;
`
