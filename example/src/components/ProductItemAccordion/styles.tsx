import styled, { css } from 'styled-components/native'

export const AccordionSection = styled.View`
  background: #FFF;
  padding-vertical: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #d9d9d9;
  align-items: flex-start;
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
  width: 22%;
  align-items: flex-start;
  justify-content: flex-start;
`

export const ProductQuantity = styled.View``

export const ContentInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  width: 78%;
  position: relative;
`

export const ProductImage = styled.View`
  margin-right: 5px;
`

export const AccordionContent = styled.View`
  overflow: hidden;
  align-items: flex-start;
`

export const ProductOptionsList = styled.View`
  margin-top: 20px;
  margin-left: 20px;
  align-items: flex-start;
`

export const ProductOption = styled.View`
  align-items: flex-start;
`

export const ProductSubOption = styled.View`
  align-items: flex-start;
  margin-left: 10px;
`

export const ProductComment = styled.View`
    align-items: flex-start;
`

export const SelectItem = styled.View`
  padding: 8px;
  align-items: center;
  flex-direction: row;
`;

export const SelectItemBtn = styled(SelectItem)`
  border-width: 1px;
  border-color: transparent;
  border-radius: 10px;
  width: 70px;
  max-width: 140px;
  margin-vertical: 5px;
  padding: 15px 20px;
  background-color: ${(props: any) => props.theme.colors.inputDisabled};
`
