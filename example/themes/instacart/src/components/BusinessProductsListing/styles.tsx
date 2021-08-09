import styled from 'styled-components/native'

export const WrapHeader = styled.View`
  position: relative;
  border-bottom-width: 16px;
  border-bottom-color: ${(props: any) => props.theme.colors.secundary}
`
export const TopHeader = styled.View`
  position: absolute;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  flex: 1;
`
export const AddressInput = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0,0,0,0.3);
  padding: 15px;
  border-radius: 24px;
`
export const WrapSearchBar = styled.View`
  padding: 5px;
  background-color: ${(props: any) => props.theme.colors.white};
  flex: 1;
`
export const WrapContent = styled.View`
  padding: 20px 40px;
`

export const BusinessProductsListingContainer = styled.ScrollView`
  flex: 1;
  margin-bottom: ${(props: any) => props.isActiveFloatingButtom ? '50px' : '0px' };
`
