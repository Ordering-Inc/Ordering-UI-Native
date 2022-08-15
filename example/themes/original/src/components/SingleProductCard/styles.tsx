import styled, { css } from 'styled-components/native'

export const CardContainer = styled.TouchableOpacity`
  flex: 1;
  flex-direction: ${(props : any) => props.showAddButton ? 'column' : 'row'};
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 10px;
  position: relative;
`
export const CardInfo = styled.View`
  padding-start: 3px;
  flex: 1;
`
export const SoldOut = styled.View`
  position: absolute;
  background: ${(props: any) => props.theme.colors.backgroundGray100} 0% 0% no-repeat padding-box;
  border-radius: 23px;
  padding: 5px 10px;
  top: 37px;
  end: 10px;
`

export const QuantityContainer = styled.View`
  background: ${({ theme }: any) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`
export const PricesContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

export const LogoWrapper = styled.View`
  position: relative;
  margin-left: 12px;
`

export const RibbonBox = styled.View`
  position: absolute;
  z-index: 1;
  top: -4px;
  right: -4px;
  background-color: ${(props: any) => props.theme.colors.primary};
  padding: 1px 8px;
  max-width: 60px;

  ${(props: any) => props.bgColor && css`
    background-color: ${props.bgColor};
  `}

  ${(props: any) => props.isRoundRect && css`
    border-radius: 7.6px;
  `}

  ${(props: any) => props.isCapsule && css`
    border-radius: 50px;
  `}
`
