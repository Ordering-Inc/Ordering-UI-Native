import styled, { css } from 'styled-components/native'

export const ProductContainer = styled.View`
  margin-bottom: 15px;
`

export const ProductHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const LikeHandsActionContainer = styled.View`
  flex-direction: row;
`

export const LikeHandsButton = styled.TouchableOpacity`
  ${(props: any) => props.isLike && css`
    margin-horizontal: 15px;
  `}
`

export const CommentsButtonGroup = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`
