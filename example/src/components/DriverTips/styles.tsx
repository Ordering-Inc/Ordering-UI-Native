import styled, { css } from 'styled-components/native'
import { colors } from '../../theme'

export const DTContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
`

export const DTCard = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border: 1px solid ${colors.primary};
  text-transform: capitalize;
  height: 60px;
  width: 60px;

  ${(props: any) => props.isActive && css`
    background-color: ${colors.primary};
    color: ${colors.primaryContrast};
  `}
`
