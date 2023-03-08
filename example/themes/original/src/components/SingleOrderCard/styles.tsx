import styled, { css } from 'styled-components/native'

export const InnerContainer = styled.View`
  flex-direction: row;
  width: 100%;
`

export const Logo = styled.View`
	border-radius: 7.6px;
  margin-right: 12px;
  ${({ isMulti } : any) => isMulti && css`
      margin-right: 5px;
    `}
`

export const CardInfoWrapper = styled.View`
  flex: 1;
`

export const ContentHeader = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`

export const ButtonWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`

export const ContentFooter = styled.View`
  flex-direction: row;
  width: 100%;
`

export const UnreadMessageCounter = styled.View`
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  width: 24px;
  height: 24px;
  border-radius: 7.6px;
  background-color: ${(props: any) => props.theme.colors.primaryContrast};
`

export const Price = styled.View`
  justify-content: space-between;
  align-items: flex-end;
  margin-left: 10px;
  width: 30%;
`

export const MultiLogosContainer = styled.View`
  display: flex;
  align-items: center;
  flex-direction: row;
`
