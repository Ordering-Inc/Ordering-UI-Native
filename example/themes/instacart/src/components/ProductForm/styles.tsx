import styled, { css } from 'styled-components/native'

export const WrapHeader = styled.View`
  position: relative;
  z-index: 1;
`

export const TopHeader = styled.View`
  position: absolute;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  z-index: 1;
  padding-horizontal: 20px;
  padding-top: 10px;
`

export const ProductHeader = styled.ImageBackground`
  flex-direction: row;
  width: 100%;
  position: relative;
  height: 294px;
  min-height: 290px;
`

export const WrapContent = styled.View`
  padding: 10px 40px;
  position: relative;
  bottom: 20px;
  background-color: white;
  z-index: 100;
`

export const ProductTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

export const ProductDescription = styled.View`
  margin-bottom: 30px;
`

export const ProductEditions = styled.View`

`

export const SectionTitle = styled.View`
  padding: 15px 0px;
`

export const WrapperIngredients = styled.View`
`

export const WrapperSubOption = styled.View`

`

export const ProductComment = styled.View`
`

export const ProductActions = styled.View`
  position: absolute;
  flex: 1;
  bottom: 0px;
  padding: 12px 40px;
  width: 100%;
  flex-direction: row;
  background-color: #FFF;
  z-index: 1000;
  border-top-width: 1px;
  border-top-color: ${(props: any) => props.theme.colors.border};
`
