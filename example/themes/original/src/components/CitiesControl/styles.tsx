import styled, { css } from 'styled-components/native'

export const Container = styled.View`
  width: 100%;
  padding: 0 20px;
  justify-content: space-between;
  padding-bottom: 12px;

  ${(props: any) => props.height && css`
    height: ${props.height}px;
  `}
`

export const CityElement = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
`
