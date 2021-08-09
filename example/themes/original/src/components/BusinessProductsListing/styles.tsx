import styled, { css } from 'styled-components/native'
import { colors } from '../../theme.json'

export const WrapHeader = styled.View`
  position: relative;
  padding-bottom: 35px;
`
export const TopHeader = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
  background-color: ${colors.white};
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
