import styled, { css } from 'styled-components/native'

export const ProductsContainer = styled.View`
`
export const ErrorMessage = styled.View`
  padding: 20px;
  width: 100%;
  background-color: #CCCCCC;
  font-weight: bold;
`

export const WrapperNotFound = styled.View`
  height: 500px;
`

export const RibbonBox = styled.View`
  margin-left: 5px;
  background-color: ${(props: any) => props.theme.colors.primary};
  padding: 2px 8px;
  max-width: 180px;

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

export const SubCategoriesContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 10px;
`

export const ContainerButton = styled.View`
`

export const HeaderWrapper = styled.View``
