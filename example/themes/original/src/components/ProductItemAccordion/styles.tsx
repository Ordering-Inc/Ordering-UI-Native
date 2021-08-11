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
    background-color: rgba(0, 0, 0, 0.1);
  `}
`

export const ProductInfo = styled.View`
	margin-horizontal: 7px;
	background-color: ${(props: any) => props.theme.colors.backgroundGray100};
	padding: 4px 12px 4px 0px;
	border-radius: 7.6px;
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
  margin-left: 10px;
`

export const ProductComment = styled.View``
