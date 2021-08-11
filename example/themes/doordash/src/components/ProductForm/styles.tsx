import styled, { css } from 'styled-components/native'
import { colors } from '../../theme.json'

export const WrapHeader = styled.View`
  position: relative;
  z-index: 1;
`

export const TopHeader = styled.View`
  position: absolute;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  start: 40px;
  top: 10px;
`

export const ProductHeader = styled.ImageBackground`
  flex-direction: row;
  width: 100%;
  position: relative;
  max-height: 216px;
  height: 216px;
  resize-mode: cover;
  min-height: 216px;
  z-index: 0;
`

export const WrapContent = styled.View`
  padding: 18px 40px;
  position: relative;
  background-color: white;
`

export const ProductTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

export const ProductDescription = styled.View`
  margin-top: 10px;
  margin-bottom: 30px;
`

export const ProductEditions = styled.View`

`

export const SectionTitle = styled.View`
  padding-vertical: 15px;
  background-color: ${colors.white};
`

export const WrapperIngredients = styled.View`
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`

export const WrapperSubOption = styled.View`
  border-radius: 7.6px;
`

export const ProductComment = styled.View`
`

export const ProductActions = styled.View`
  position: absolute;
  flex: 1;
  bottom: 0px;
  padding-horizontal: 40px;
  width: 100%;
  flex-direction: row;
  background-color: ${colors.clear};
  z-index: 1000;
`
