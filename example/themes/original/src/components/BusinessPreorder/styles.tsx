import styled, { css } from 'styled-components/native'

export const PreOrderContainer = styled.ScrollView``

export const BusinessInfoWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const PreorderTypeWrapper = styled.View`
  margin-top: 23px;
`

export const MenuWrapper = styled(PreorderTypeWrapper)``

export const OrderTimeWrapper = styled.View`
  margin-top: 34px;
`

export const TimeListWrapper = styled.ScrollView`
  margin-top: 30px;
  max-height: 160px;
`

export const TimeContentWrapper = styled.View`
  flex: 1;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
`

export const TimeItem = styled.View`
  width: 86px;
  height: 34px;
  background: #E9ECEF;
  border-radius: 7.6px;
  justify-content: center;
  align-items: center;
  margin: 10px 0px;
  ${({ active }: any) => active && css`
    background: #F5F9FF;
  `}
`

export const PreorderTypeListWrapper = styled.ScrollView``

export const DropOption = styled.View`
  padding: 10px;
  margin-bottom: 5px;
  font-size: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.lightGray};
  flex-direction: row;
  align-items: center;
`
