import React from 'react'
import styled, { css } from 'styled-components/native'

export const AccordionSection = styled.View`
  background: #FFF;
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #d9d9d9;

`

const AccordionStyled = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const Accordion = (props: any) => {
  const style : any = {}
  if (!props.isValid) {
    style.opacity = '0.5'
  }
  return (
    <AccordionStyled
      {...props}
      style={style}
    >
      {props.children}
    </AccordionStyled>
  )
}

export const ProductInfo = styled.View`
  width: 15%
`

export const ProductQuantity = styled.View`
`

export const ContentInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 10px;
  overflow: hidden;
  width: 85%
`

export const ProductImage = styled.View`
  margin-right: 10px
`

export const AccordionContent = styled.View`
  overflow: hidden;
`

export const ProductOptionsList = styled.View`
  margin-top: 20px;
  margin-left: 20px
`

export const ProductOption = styled.View`
`

export const ProductSubOption = styled.View`
  margin-left: 10px
`

export const ProductComment = styled.View`

`
