import styled, { css } from 'styled-components/native'

export const Wrapper = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.white};
`
export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props: any) => props.theme.colors.white};
  box-shadow: 0 2px 2px #0000001A;
  padding-bottom: 10px;
  padding-horizontal: 10px;
`

export const TitleHeader = styled.View``

export const QuickMessageContainer = styled.ScrollView``

export const ProfileMessageHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0px;
  padding-horizontal: 20px;
`
export const MessageTypeItem = styled.View`
  justify-content: center;
  align-items: center;
  padding-horizontal: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
  margin-right: 5px;
  border-radius: 7.6px;
  overflow: hidden;
  
  ${({ active }: any) => active && css`
    background-color: ${(props: any) => props.theme.colors.whiteGray};
  `}
`
