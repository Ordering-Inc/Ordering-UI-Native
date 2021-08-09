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
  min-width: 120px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 3px;
  margin-top: 10px;
  padding: 12px 0 14px;
  padding-end: 20px;

  ${(props: any) => props.theme?.rtl && css`
    margin-left: 10px;
    margin-right: 0;
  `}
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
`

export const PMCardSelected = styled.View`
  padding: 20px 0px 0px;
`

export const PMCardItemContent = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  font-weight: bold;
`
