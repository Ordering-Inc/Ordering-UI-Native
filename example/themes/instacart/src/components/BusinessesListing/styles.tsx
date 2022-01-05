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
  flex-direction: row;
  background-color: ${(props: any) => props.theme.colors.white};
  border-radius: 3px;
  align-items: center;
  padding-vertical: 4px;
  margin-bottom: 10px;
  flex: 1;
  width: 100%;
  z-index: -10;
`

export const OrderControlContainer = styled.View`
  width: 100%;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  padding-bottom: 20px;
  flex: 1;
`

export const WrapMomentOption = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.inputDisabled};
  border-radius: 3px;
  padding-horizontal: 10px;
  max-width: 240px;
  flex-direction: row;
  align-items: center;
  margin-start: 15px;
  min-height: 28px;
`
