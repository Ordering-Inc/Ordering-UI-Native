import styled, { css } from 'styled-components/native'

export const ReviewProductsContainer = styled.ScrollView`
  padding: 20px;
  margin-bottom: 100px;
`

export const ActionContainer = styled.View`
  ${(props: any) => props.isContinueEnabled && css`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `}
  padding: 3px 10px;
`

export const SkipButton = styled.TouchableOpacity`
`
