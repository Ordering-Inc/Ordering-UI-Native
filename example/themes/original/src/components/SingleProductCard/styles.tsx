import styled, { css } from 'styled-components/native'

export const CardInfo = styled.View`
  padding-start: 3px;
  flex: 1;
  min-height: 85px;
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
  ${({ businessSingleId }: any) => businessSingleId ? css`
    left: 0;
  ` : css`
    right: 0;
  `}
`
export const PricesContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: 6px;
`

export const LogoWrapper = styled.View`
  position: relative;
  margin-left: ${(props) => !props.logoPosition || props.logoPosition === 'right' ? '12px' : '0px'};
  margin-right: ${(props) => props.logoPosition === 'right' ? '0px' : '12px'};
`
export const WrapTags = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-left: 10px;
`
export const TagsContainer = styled.View`
    display: flex;
    margin: auto;
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

  ${(props: any) => props.colorText && css`
    color: ${props.colorText ? 'black' : 'white'};
  `}

  ${(props: any) => props.borderRibbon && css`
    border: 1px solid ${props.borderRibbon ? 'black' : 'white'};
  `}
`
