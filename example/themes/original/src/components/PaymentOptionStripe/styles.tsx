import styled, { css } from 'styled-components/native';

export const OSContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  width: 100%;
  position: relative;
`;

export const OSMessage = styled.Text`
  color: #D81212;
  font-size: 24px;
  padding-left: 10px;
  font-weight: bold;
  opacity: 0.8;
  /* ${(props: any) => props.theme?.rtl && css`
    padding-right: 10px;
    padding-left: 0;
  `} */
`;

export const OSWrapper = styled.View`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const OSCardList = styled.ScrollView`
  flex: 1;
`

export const OSItem = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px;
  ${({ isInvalid } : any) => isInvalid && css`
    opacity: 0.7;
  `}
`;

export const OSItemContent = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 90%;

  /* > * {
    ${(props: any) => props.theme?.rtl && css`
      margin-left: 10px;
      margin-right: 0;
    `}
  } */
`;

export const OSItemActions = styled.View`
  max-width: 10%;
`;

export const OSActions = styled.View`
  width: 100%;
  display: flex;
  padding: 30px 20px 0px;
  flex-direction: row;
  justify-content: space-between;
`;
