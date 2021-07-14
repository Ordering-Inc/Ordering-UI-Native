
import styled from 'styled-components/native'

export const Wrapper = styled.View`
  flex: 1;
  background-color: ${({ colors }: any) => colors.white};
`
export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-bottom-width: 1px;
  border-bottom-color: #d9d9d9;
  padding-bottom: 10px;
  padding-horizontal: 20px;
`

export const TitleHeader = styled.View`
  align-items: flex-start;
  max-width: 85%;
`
