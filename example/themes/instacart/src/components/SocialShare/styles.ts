import styled from 'styled-components/native';

export const FavItem = styled.TouchableOpacity`
	position: relative;
	width: 30px;
	height: 30px;
	justify-content: center;
	align-items: center;
	overflow: visible;
`;

export const FavMenu = styled.View`
	display: flex;
	position: absolute;
	top: 30px;
	z-index: 99999;
	align-items: center;
	width: 50px;
	height: 170px;
`;
