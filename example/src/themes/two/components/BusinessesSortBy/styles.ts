import styled from 'styled-components/native';
import { colors } from '../../theme.json';

export const BussFilterWrap = styled.View`
	margin-horizontal: -40px;
	margin-bottom: 20px;
`;

export const InnerWrapScroll = styled.ScrollView`

`;

export const FilterItem = styled.TouchableOpacity`
	height: 34px;
	padding-horizontal: 16px;
	align-items: center;
	justify-content: center;
	border-radius: 20px;
	background-color: ${colors.backgroundGray300};
	margin-end: 16px;
`;