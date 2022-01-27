import styled, { css } from 'styled-components/native'

export const WrapHeader = styled.View`
  position: relative;
  z-index: 1;
  margin-bottom: 20px;
`

export const TopHeader = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  padding-horizontal: 40px;
`

export const ProductHeader = styled.ImageBackground`
  flex-direction: row;
  width: 100%;
  position: relative;
  max-height: 258px;
  height: 258px;
  resize-mode: contain;
  min-height: 200px;
  z-index: 0;
`

export const WrapContent = styled.View`
  padding: 0 40px;
  background-color: #FFF;
`

export const ProductTitle = styled.View`
  justify-content: flex-start;
  padding-bottom: 7px;
`

export const ProductDescription = styled.View`
  margin-bottom: 10px;
`

export const ProductEditions = styled.View`

`

export const SectionTitle = styled.View`
  padding: 15px 0px;
`

export const WrapperIngredients = styled.View`
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`

export const WrapperSubOption = styled.View`
`

export const ProductComment = styled.View`
  padding-bottom: 40px
`

export const ProductActions = styled.View`
  position: absolute;
  bottom: 0px;
	min-height: 70px;
  padding: 12px 40px;
  width: 100%;
  flex-direction: row;
  background-color: #FFF;
  z-index: 1000;
  align-items: center;
  justify-content: space-between;
  border-top-width: 1px;
  border-top-color: ${(props: any) => props.theme.colors.border};
  flex: 1;
  flex-direction: row;
`

export const ExtraOptionWrap = styled.ScrollView`
	margin-horizontal: -40px;
`;
