import styled, { css } from 'styled-components/native'

export const PMContainer = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
`
export const PMItem = styled.View`
  width: 120px;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 10px;
  margin-top: 10px;
  text-align: center;
  background-color: ${(props: any) => props.theme.colors.inputDisabled};

  ${(props: any) => props.theme?.rtl && css`
    margin-left: 10px;
    margin-right: 0;
  `}

  ${(props: any) => props.isActive ? css`
    background-color: ${(props: any) => props.theme.colors.primary};
  ` : css`
    border: 1px solid #EAEAEA;
  `}
`
export const WalletItem = styled.TouchableOpacity`
  width: 100%;
  display: flex;
  padding: 20px 0;
  margin-top: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top-width: 1px;
  border-top-color: ${(props: any) => props.theme.colors.backgroundGray200};
  ${(props: any) => props.isBottomBorder && css`
    border-bottom-width: 1px;
    border-bottom-color: ${(props: any) => props.theme.colors.backgroundGray200};
  `}
`
