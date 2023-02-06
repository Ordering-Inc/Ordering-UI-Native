import styled, { css } from 'styled-components/native'

export const ProductContainer = styled.View`
  margin-bottom: 15px;
`

export const ProductHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`

export const LikeHandsActionContainer = styled.View`
  flex-direction: row;
`

export const LogoWrapper = styled.View`
  shadowRadius: 3;
  shadowOffset: { width: 1, height: 4 };
  elevation: 3;
  border-radius: 8;
  shadowOpacity: 0.1;
  overflow: hidden;
  width: 80;
  marginLeft: auto;
  marginRight: auto;
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
