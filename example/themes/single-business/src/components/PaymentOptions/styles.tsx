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
  height: 44px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 7.6px;
  margin-vertical: 4px;
  text-align: center;
  background-color: ${(props: any) => props.theme.colors.inputDisabled};

  ${(props: any) => props.theme?.rtl && css`
    margin-left: 10px;
    margin-right: 0;
  `}

  /* ${(props: any) => props.isDisabled && css`
    pointer-events: none;
  `} */

  ${(props: any) => props.isActive ? css`
    background-color: ${(props: any) => props.theme.colors.primary};
  ` : css`
    border: 1px solid #EAEAEA;
  `}
  padding-horizontal: 14px;
`

export const PMCardSelected = styled.View`
  padding: 30px 0px 0px;
`

export const PMCardItemContent = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  font-weight: bold;
`

export const PMDropDownWrapper = styled.TouchableOpacity`
  position: relative;
  min-height: 44px;
  height: 44px;
  border-radius: 7.6px;
  background-color: ${(props: any) => props.theme.colors.inputDisabled};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
`;

export const PMDropDownCont = styled.View`
  border-radius: 8px;
  width: 100%;
  padding: 10px 0 0;
  box-shadow: 0 2px 3px #0000004D;
  z-index: 99999;
`;
