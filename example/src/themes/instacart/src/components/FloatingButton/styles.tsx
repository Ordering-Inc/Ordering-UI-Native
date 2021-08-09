import styled, { css } from 'styled-components/native'

export const Container = styled.View`
  position: absolute;
  flex: 1;
  bottom: 0px;
  left: 0;
  padding: 12px 40px;
  border-top-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFF;
  z-index: 1000;
`

export const Button = styled.TouchableOpacity`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-radius: 3px;
  height: 42px;
  padding: 5px;
  background-color: ${(props: any) => props.theme.colors.primary};
`
