import styled from 'styled-components/native';
import { colors } from '../../theme';

export const CContainer = styled.View`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding: 5px 0px;
`

export const CCWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const CCButton = styled.View`
  width: 100%;
  background-color: ${colors.backgroundGray};
  padding: 10px;
  border-radius: 50px;
`
