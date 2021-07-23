import styled from 'styled-components/native';

export const ChContainer = styled.View`
  margin-bottom: 60px;
  padding-horizontal: 30px;
`

export const ChSection = styled.View`
`

export const ChTotal = styled.View`
`

export const ChAddress = styled.View`
  margin-top: 40px;  
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.mediumGray};
`

export const ChMoment = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.mediumGray};
  padding: 20px 0;
`

export const CHMomentWrapper = styled.TouchableOpacity`
  margin-top: 10px;
  background-color: ${(props: any) => props.theme.colors.black};
  border-radius: 35px;
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  flex-direction: row;
`

export const ChUserDetails = styled.View`
  padding-vertical: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.mediumGray};
`

export const ChBusinessDetails = styled(ChUserDetails)`
`

export const ChPaymethods = styled(ChUserDetails)`
  padding: 20px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.inputDisabled};
`

export const ChDriverTips = styled(ChUserDetails)``

export const ChCart = styled(ChPaymethods)``

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
