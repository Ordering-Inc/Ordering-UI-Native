import styled, { css } from 'styled-components/native'
import { colors } from '../../theme.json';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.border}
`

export const IconControl = styled.TouchableOpacity`
  flex-direction: row;
  flex: 1;
  align-items: center;
`

export const QuantityControl = styled.View`
  flex-direction: row;
  align-items: center;
  margin-horizontal: 5px;
`

export const PositionControl = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 5px;
`

export const Checkbox = styled.TouchableOpacity`
`

export const Circle = styled.TouchableOpacity`
`
