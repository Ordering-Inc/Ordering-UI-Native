import styled from 'styled-components/native';
import { colors } from '../../theme.json';

export const OSContainer = styled.View`
	display: flex;
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: rgba(0,0,0,0.5);
`

export const OSContent = styled.View`
	width: 70%;
	max-width: 400px;
	border-radius: 6px;
	padding: 10px;
	background-color: ${colors.white}
`

export const OSBody = styled.View`
	padding: 20px;
`
