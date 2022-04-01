import styled, { css } from 'styled-components/native'

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  width: 100%;
`

export const IconControl = styled.TouchableOpacity`
  flex-direction: row;
  width: 45%;
  align-items: center;
`

export const QuantityControl = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-horizontal: 5px;
  flex: 1;
  width: 60px;

`

export const PositionControl = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 5px;
  flex: 1;
`

export const Checkbox = styled.TouchableOpacity`
`

export const Circle = styled.TouchableOpacity`
  margin: 0 1px;
`
