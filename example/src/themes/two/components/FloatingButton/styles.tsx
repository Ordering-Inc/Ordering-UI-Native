import styled, { css } from 'styled-components/native'
import { colors } from '../../theme.json'
export const Container = styled.View`
  position: absolute;
  flex: 1;
  bottom: 0px;
  left: 0;
  padding-vertical: 10px;
  padding-horizontal: 40px;
  border-top-width: 1px;
  border-color: ${colors.clear};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

export const Button = styled.TouchableOpacity`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-radius: 25px;
  height: 40px;
`
