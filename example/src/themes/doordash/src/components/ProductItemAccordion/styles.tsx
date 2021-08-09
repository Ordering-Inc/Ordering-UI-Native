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
  width: 24px;
  position: absolute;
  start: 0;
  top: 14px;
  z-index: 10;
`
export const ProductQuantity = styled.View`
	margin-end: 7px;
`

export const ContentInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
`
export const ProductImage = styled.View`
  margin-end: 7px;
  margin-start: 12px;
`

export const AccordionContent = styled.View`
  overflow: hidden;
`

export const ProductOptionsList = styled.View`
  flex-wrap: wrap;
`

export const ProductOption = styled.View``

export const ProductSubOption = styled.View`
  margin-left: 10px;
`

export const ProductComment = styled.View``
