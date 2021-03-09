import styled, {css} from 'styled-components/native'
import { colors } from '../../theme'

export const Container = styled.View`
  flex: 1;
  height: 100%;
  ${(props: any) => !props.nopadding && css`
    padding: 20px;
  `}
  background-color: ${colors.backgroundPage};
`