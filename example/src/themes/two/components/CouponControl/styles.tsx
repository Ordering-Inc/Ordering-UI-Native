import styled from 'styled-components/native';
import { colors } from '../../theme.json';

export const CContainer = styled.View`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding: 5px 0px;
  min-height: 50px;
`

export const CCWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`

export const CCButton = styled.View`
	width: 100%;
  background-color: ${colors.backgroundGray};
  padding: 10px;
  border-radius: 50px;
`
