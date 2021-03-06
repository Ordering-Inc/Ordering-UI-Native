import styled from 'styled-components/native'
import { colors } from '../../theme.json'

export const Container = styled.View`
`

export const WrapHeader = styled.View`
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  background-color: ${colors.paleGray};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`
