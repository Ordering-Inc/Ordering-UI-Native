import styled from 'styled-components/native'
import { colors } from '../../theme.json'

export const Card = styled.View`
  border: 1px solid ${colors.border};
  flex: 1;
  padding: 10px;
  margin-bottom: 24px;
  border-radius: 2px;
  flex-direction: row;
  min-height: 97px;
  height: 97px;
`

export const Logo = styled.View`
`

export const Information = styled.View`
  justify-content: space-between;
  align-items: flex-start;
  margin-horizontal: 10px;
  flex: 1;
`

export const MyOrderOptions = styled.View`
  flex-direction: row;
  align-items: center;
`

export const Status = styled.View`
  align-items: center;
  justify-content: center;
  width: 100px;
`

export const WrappButton = styled.View`
`
