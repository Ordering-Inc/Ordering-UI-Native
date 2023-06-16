import styled, { css } from 'styled-components/native'

export const WrapHeader = styled.View`
  position: relative;
`
export const TopHeader = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ hideArrow }: any) => hideArrow ? 'flex-end' : 'space-between'};
  z-index: 1;
  height: 60px;
  min-height: 60px;
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
  padding-vertical: 10px;
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
  z-index: 20000;
`

export const BackgroundGray = styled.View`
  flex: 1;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  position: absolute;
  z-index: 10000;
  width: 100%;
`

export const ProfessionalFilterWrapper = styled.View`
  padding-left: 20px;
  margin-bottom: 35px;
`

export const NearBusiness = styled.View`
  width: 100%;
  padding-left: 20px;
  max-height: 80px;
`

export const TopActions = styled.TouchableOpacity`
	height: 60px;
	justify-content: center;
  padding-horizontal: 20px;
  width: 100px;
`;
