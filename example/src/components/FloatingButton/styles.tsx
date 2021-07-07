import styled, { css } from 'styled-components/native'
import { colors } from '../../theme.json'
export const Container = styled.View`
  position: absolute;
  bottom: 0px;
  left: 0;
  padding: 12px;
  padding-end: 40px;
  padding-start: 40px;
  flex-direction: row;
  border-top-width: 1px;
  border-color: ${colors.border};
  width: 100%;
  justify-content: space-between;
  background-color: #FFF;
  z-index: 1000;
`

export const Button = styled.TouchableOpacity`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 0px;
  height: 50px;
  background-color: transparent;
`
