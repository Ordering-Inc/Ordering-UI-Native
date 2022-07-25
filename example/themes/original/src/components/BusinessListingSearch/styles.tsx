import styled, { css } from 'styled-components/native'

export const WrapHeader = styled.View`
  width: 100%;
	padding-vertical: 20px;
`

export const SearchWrapper = styled.View`

`

export const ProductsList = styled.View`

`

export const SingleBusinessSearch = styled.View`
  width: 100%;
  margin: 20px 0;
`

export const BusinessInfo = styled.View`
  width: 15%;
  flex-direction: row;
`

export const BusinessLogo = styled.View`

`

export const BusinessInfoItem = styled.View`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
  margin-left: 10px;
`

export const Metadata = styled.View`
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

export const SingleBusinessContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`

export const LoadMoreBusinessContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-left: 20px;
`

export const ProgressBar = styled.View`
  height: 4px;
  background: ${(props: any) => props.theme.colors.textNormal};
`

export const ProgressContentWrapper = styled.View`
  height: 4px;
  background: #F8F9FA;
  margin-bottom: 10px;
  flex: 1;
`

export const TagsContainer = styled.View`
  padding-bottom: 10px;
`

export const SortContainer = styled.View`
  margin-bottom: 10px;
`

export const BrandContainer = styled.View``

export const BrandItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
  align-items: center;
`

export const PriceFilterWrapper = styled.View`
  margin-bottom: 20px;
`

export const OptionTitle = styled.View`
	margin-top: 24px;
	${(props: any) => props.titleContent && css`
		margin-left: ${() => props.isBusinessesSearchList ? '0' : '40px'};
	`}
`
