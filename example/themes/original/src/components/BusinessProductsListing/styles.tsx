import styled, { css } from 'styled-components/native'

export const ContainerSafeAreaView = styled.SafeAreaView`
`

export const WrapHeader = styled.View`
  position: relative;
`
export const TopHeader = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  height: 60px;
  min-height: 60px;
  margin-top: ${(props : any) => props.isIos ? '0' : '40px'};
`
export const AddressInput = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0,0,0,0.3);
  padding: 15px;
  border-radius: 24px;
`
export const WrapSearchBar = styled.View`
  padding: 8px 30px;
  background-color: ${(props: any) => props.theme.colors.white};
  flex: 1;
`
export const WrapContent = styled.View`
  padding: 10px 40px;
`

export const BusinessProductsListingContainer = styled.ScrollView`
  flex: 1;
  ${({ isActiveFloatingButtom }: { isActiveFloatingButtom: boolean }) => isActiveFloatingButtom && css`
    margin-bottom: 50px;
  `}
`

export const FiltProductsContainer = styled.ScrollView`
  position: absolute;
  width: 100%;
  z-index: 2000;
  top: ${(props : any) => props.isIos ? '40px': '80px'};
  margin-top: 20px;
`

export const BackgroundGray = styled.View`
  flex: 1;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  position: absolute; 
  margin-top: 100px; 
  z-index: 100;
  width: 100%;
`
