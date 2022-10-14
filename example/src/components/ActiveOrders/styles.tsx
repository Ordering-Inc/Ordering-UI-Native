import styled, { css } from 'styled-components/native'

export const ActiveOrdersContainer = styled.ScrollView``

export const Card = styled.TouchableOpacity`
  flex: 1;
  border: 1px solid ${(props: any) => props.theme.colors.primary};
  border-radius: 20px;
  margin-right: 10px;
  min-width: 320px;
  width: 320px;
  margin-bottom: 10px;
  ${({ isMiniCard }: { isMiniCard: boolean }) => !isMiniCard && css`
    padding: 10px 0;
  `};
`

export const Map = styled.View`
  flex: 1;
`

export const Information = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
  padding: 10px;
`

export const Logo = styled.View``

export const OrderInformation = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  padding-left: 10px;
`

export const BusinessInformation = styled.View``

export const Price = styled.View`
  justify-content: space-between;
  align-items: flex-end;
  margin-left: 10px;
  width: 30%;
`
