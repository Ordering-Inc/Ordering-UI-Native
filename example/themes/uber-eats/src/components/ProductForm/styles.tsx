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
  justify-content: space-between;
  z-index: 1;
`

export const ProductHeader = styled.ImageBackground`
  flex-direction: row;
  width: 100%;
  position: relative;
  max-height: 300px;
  height: 300px;
  resize-mode: cover;
  min-height: 200px;
  z-index: 0;
`

export const WrapContent = styled.View`
  padding: 10px 0px;
  position: relative;
  background-color: white;
  z-index: 100;
`

export const ProductTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-horizontal: 30px;
`

export const ProductDescription = styled.View`
  margin-horizontal: 30px;
  margin-vertical: 6px;
`

export const ProductEditions = styled.View`
`

export const SectionTitle = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  background-color: ${(props: any) => props.theme.colors.paleGray};
`

export const WrapperIngredients = styled.View`
  ${((props: any) => props.hidden && css `
    max-height: 0px;
  `)}
`

export const WrapperSubOption = styled.View`
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

export const WrapperArrowIcon = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.lightGray};
  padding: 2px;
  border-radius: 20px;
  ${((props: any) => props.rotate && css`
    transform: rotate(180deg);
  `)}
`
