import styled, { css } from 'styled-components/native'

export const AccordionSection = styled.View`
  background: #FFF;
  padding-vertical: 12px;
  width: 100%;
`

export const Accordion = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  overflow: hidden;

  ${(props: any) => !props.isValid && css`
    background-color: rgba(0, 0, 0, 0.1);
  `}
`

export const ProductInfo = styled.View`
  width: 36px;
  height: 30px;
  margin-end: 12px;
`

export const ProductQuantity = styled.View`
	min-height: 30px;
	align-items: center;
	justify-content: center;
`

export const ContentInfo = styled.View`
  flex: 1;
`

export const ProductImage = styled.View`
  margin-right: 12px;
`

export const AccordionContent = styled.View`
  overflow: hidden;
`

export const ProductOptionsList = styled.View`
`

export const ProductOption = styled.View``

export const ProductSubOption = styled.View`
  margin-left: 10px;
`

export const ProductComment = styled.View``
