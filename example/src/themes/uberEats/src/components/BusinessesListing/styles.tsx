import styled from 'styled-components/native'

export const BusinessListContainer = styled.View`
  flex: 1;
  flex-direction: column;
  padding: 0px 30px 20px 30px;
`

export const Divider = styled.View`
  height: 8px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray};
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
  justify-content: center;
  border-radius: 10px;
  align-items: center;
  margin-horizontal: 10px;
  width: 100%;
`

export const OrderControlContainer = styled.View`
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
`

export const WrapMomentOption = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.primary};
  border-radius: 20px;
  margin-vertical: 5px;
  height: 40px;
  flex-direction: row;
  align-items: center;
  padding: 0px 20px;
  margin-horizontal: 10px;
  max-width: 240px;
`
