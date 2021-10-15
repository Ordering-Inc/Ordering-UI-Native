import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  position: absolute;
  flex: 1;
  bottom: 0px;
  left: 0;
  padding-vertical: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: #fff;
  z-index: 1000;
  ${(props: any) =>
    props.isIos &&
    css`
      padding-bottom: ${(props: any) => props.paddingBottomIos ? `${props.paddingBottomIos}px` : '5px'};
    `}
`;

export const Button = styled.TouchableOpacity`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 7px;
  height: 50px;

  ${(props: any) =>
    css`
      width: ${props.secondButton ? '45%' : '100%'};
    `}
  flex-direction: row;
`;
