import React from 'react';
import { ViewStyle } from 'react-native';

import styled from 'styled-components/native';
import OImage from './OImage';
import OText from './OText';
import { colors } from '../../theme.json';

const CardContainer = styled.TouchableOpacity`
	width: 46%;
	margin: 2%;
	overflow: hidden;
`

const CardBody = styled.View`
	padding: 4%;
`

const OCard = (props: Props): React.ReactElement => {
	return (
		<CardContainer
		 style={{...props.style}}
		 onPress={props?.onPress}
		 disabled={!props?.onPress}
		>
			<OImage
				source={props.image}
				height={150}
				resizeMode="cover"
				borderRadius={16}
			/>
			<CardBody>
				<OText
					mLeft={0}
					size={18}
					numberOfLines={2}
					mBottom={8}
				>
					{props.title}
				</OText>

				<OText
					color={colors.mediumGray}
					numberOfLines={3}
					mBottom={8}
				>
					{props.description}
				</OText>

				<OText>
					<OText
						color={colors.primary}
						weight="bold"
					>
						{props.price}
					</OText>

					<OText
						color={colors.mediumGray}
						size={12}
						style={{textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}
					>
						{props?.prevPrice ? `  ${props?.prevPrice}  ` : ''}
					</OText>
				</OText>
			</CardBody>
		</CardContainer>
	);
}

interface Props {
	onPress?(): void;
	image: string;
	title: string;
	description: string;
	price: string;
	prevPrice?: string;
	style?: ViewStyle;
}

export default OCard;
