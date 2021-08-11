import styled from 'styled-components/native';

export const ChContainer = styled.View`
  margin-bottom: 60px;
  padding-horizontal: 40px;
`

export const ChSection = styled.View`
	flex-direction: row;
	padding-vertical: 16px;
	flex: 1;
`

export const ChHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 0px;
  padding-bottom: 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
  margin-bottom: 16px;
  padding-horizontal: 40px;
`

export const ChTotal = styled.View`
  background-color: ${(props: any) => props.theme.colors.inputDisabled};
  padding: 10px 20px;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
`

export const ChTotalWrap = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const ChAddress = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const ChMoment = styled(ChAddress)`
  padding: 0 0 20px;
`

export const CHMomentWrapper = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.inputDisabled};
  border-radius: 3px;
  padding-horizontal: 10px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-start: 15px;
`

export const ChUserDetails = styled.View`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`

export const ChBusinessDetails = styled(ChUserDetails)`
`

export const ChPaymethods = styled.View`
  flex: 1;
  flex-direction: column;
`

export const ChDriverTips = styled(ChPaymethods)`
	overflow: hidden;
`

export const ChCart = styled(ChPaymethods)`
	
`

export const ChPlaceOrderBtn = styled.View`
  width: 100%;
  display: flex;
  justify-content: center;
`

export const ChErrors = styled.View`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`

export const DivideLine = styled.View`
	height: 1px;
	background-color: ${(props: any) => props.theme.colors.border};
	margin-horizontal: -40px;
`
export const PayActionCont = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
`;