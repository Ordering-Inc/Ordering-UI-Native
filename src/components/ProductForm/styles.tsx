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
`

export const ProductHeader = styled.ImageBackground`
  flex-direction: row;
  width: 100%;
  position: relative;
  max-height: 260px;
  height: 260px;
  resize-mode: cover;
  min-height: 200px;
  z-index: 0;
`

export const WrapContent = styled.View`
  padding: 10px 20px;
  position: relative;
  bottom: 20px;
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
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
  padding: 15px 20px;
  background-color: ${colors.paleGray};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`

export const WrapperIngredients = styled.View`
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`

export const WrapperSubOption = styled.View`
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`

export const ProductComment = styled.View`
`

export const ProductActions = styled.View`
  position: absolute;
  flex: 1;
  bottom: 0px;
  padding: 20px;
  width: 100%;
  flex-direction: row;
  background-color: #FFF;
  z-index: 1000;

  ${((props: any) => props.isIos && css `
    padding-bottom: 20px;
  `)}
`
