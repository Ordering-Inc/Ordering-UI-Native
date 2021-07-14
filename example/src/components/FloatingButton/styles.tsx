import styled, { css } from 'styled-components/native'

export const Container = styled.View`
  position: absolute;
  flex: 1;
  bottom: 0px;
  left: 0;
  padding: 10px;
  border-top-width: 1px;
  border-color: ${({ colors }: any) => colors.lightGray};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFF;
  z-index: 1000;

  ${((props: any) => props.isIos && css `
    padding-bottom: 20px;
  `)}
`

export const Button = styled.TouchableOpacity`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 90%;
  justify-content: space-between;
  align-items: center;
  border-radius: 25px;
  height: 50px;
`
