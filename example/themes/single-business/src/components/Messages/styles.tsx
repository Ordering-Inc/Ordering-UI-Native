
import styled from 'styled-components/native'

export const Wrapper = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.white};
`
export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background-color: ${(props: any) => props.theme.colors.white};
  box-shadow: 0 2px 2px #0000001A;
  padding-bottom: 10px;
  padding-top: 14px;
`

export const TitleHeader = styled.View`

`
