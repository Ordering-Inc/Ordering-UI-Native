import styled, { css } from 'styled-components/native'

export const WrapHeader = styled.View`
  position: relative;
  padding-bottom: 35px;
`
export const TopHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  height: 60px;
  min-height: 60px;
  width: 100%;
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
