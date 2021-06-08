import React from 'react';
import { ViewStyle } from 'react-native';

import styled from 'styled-components/native';

const Wrapper = styled.View`
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
`

const GridContainer = (props: Props): React.ReactElement => {
	return (
		<Wrapper {...props.style}>
			{props.children}
		</Wrapper>
	);
}

interface Props {
	children: any;
	style?: ViewStyle;
}

export default GridContainer;
