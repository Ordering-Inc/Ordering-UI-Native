import styled, { css } from 'styled-components/native';

export const PMContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const PMList = styled.View`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
`

export const PMItem = styled.View`
  width: 120px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 7.6px;
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

export const PMCardSelected = styled.View`
  padding: 30px 0px 0px;
`

export const PMCardItemContent = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-weight: bold;
`
