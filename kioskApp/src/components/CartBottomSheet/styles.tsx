import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../../theme.json';

const _dim = Dimensions.get('window');

export const StyledContainer = styled.ScrollView`
	position: absolute;
	zIndex: 1000;
	width: 100%;
	background-color: #fff;
	padding: 20px;
	bottom: 0;
	shadow-color: #000;
	shadow-opacity:  0.4;
	shadow-radius: 3px;
	elevation: 15;
`

export const StyledContent = styled.ScrollView`
	padding: 0 20px;
	margin: 20px;
	border-radius: 6px;
	background-color: ${colors.whiteGray};
	height: ${_dim.height * 0.36}px;
`
export const StyledTopBar = styled.View`
	padding: 20px 0;
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
`

export const StyledBottomContent = styled.View`
	padding: 0 20px;
	height: ${_dim.height * 0.1}px;
    width: 100%;
`

export const StyledCartItem = styled.View`
	width: 100%;
	height: 60px;
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 14px;
`
