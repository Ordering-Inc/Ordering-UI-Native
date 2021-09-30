import styled, { css } from 'styled-components/native';

export const AccordionSection = styled.View`
  background: #fff;
  padding-vertical: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #d9d9d9;
`;

export const Accordion = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  ${(props: any) =>
    !props.isValid &&
    css`
      background-color: rgba(0, 0, 0, 0.1);
    `}
`;

export const ProductInfo = styled.View`
  width: 15%;
`;

export const ProductQuantity = styled.View``;

export const ContentInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
  width: 100%;
`;

export const ProductImage = styled.View`
  margin-right: 5px;
`;

export const AccordionContent = styled.View``;

export const ProductOptionsList = styled.View`
  margin-top: 10px;
  margin-left: 18px;
`;

export const ProductOption = styled.View`
  flex-direction: column;
  flex-wrap: wrap;
`;

export const ProductSubOption = styled.View`
  flex-direction: row;
  margin-left: 3px;
`;

export const ProductComment = styled.View`
  flex-direction: column;
  flex-wrap: wrap;
  margin-left: 18px;
`;
