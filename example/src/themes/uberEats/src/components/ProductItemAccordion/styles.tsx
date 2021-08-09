import styled, { css } from 'styled-components/native'

export const AccordionSection = styled.View`
  background: #FFF;
  padding-vertical: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #d9d9d9;
`

export const Accordion = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  ${(props: any) => !props.isValid && css`
    background-color: rgba(0, 0, 0, 0.1);
  `}
`

export const ProductInfo = styled.View`
  width: 15%;
`

export const ProductQuantity = styled.View`
  background-color: ${(props: any) => props.theme.colors.backgroundGray};
  flex-direction: row;
  justify-content: center;
  padding-vertical: 7px;
`

export const ContentInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  width: 85%;
`

export const ProductImage = styled.View`
  margin-right: 5px;
`

export const AccordionContent = styled.View`
  overflow: hidden;
`

export const ProductOptionsList = styled.View`
  margin-top: 20px;
  margin-left: 20px;
`

export const ProductOption = styled.View``

export const ProductSubOption = styled.View`
  margin-left: 10px;
`

export const ProductComment = styled.View``
