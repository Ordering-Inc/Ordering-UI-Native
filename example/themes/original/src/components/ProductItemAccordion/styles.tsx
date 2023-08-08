import styled, { css } from 'styled-components/native'

export const AccordionSection = styled.View`
  background: #FFF;
  padding-vertical: 10px;
`

export const Accordion = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  ${(props: any) => !props.isValid && css`
    opacity: 0.7;
  `}
`

export const ProductInfo = styled.View`
	margin-horizontal: 7px;
`

export const ProductQuantity = styled.View`
	background-color: ${(props: any) => props.theme.colors.clear};
	margin-horizontal: 7px;
	min-width: 16px;
	align-items: center;
`

export const ContentInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
`

export const ProductImage = styled.View`
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
  margin-left: 0px;
`

export const ProductComment = styled.View`
margin-left: 20px;
`
