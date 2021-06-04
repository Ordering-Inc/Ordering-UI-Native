import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';

import styled from 'styled-components/native';
import { colors } from '../../theme.json';
import { OImage, OText } from '../shared';

const CardContainer = styled.TouchableOpacity`
	width: 100%;
	overflow: hidden;
	background-color: ${colors.mediumGray};
	border-radius: 16px;
`

const CardBody = styled.View`
	padding: 2% 4%;
	position: absolute;
	background-color: transparent;
	z-index: 100;
	width: 60%;
	height: 100%;
	right: 0;
	justify-content: center;
`

const PromoCard = (props: Props): React.ReactElement => {
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

				{props?.subtitle && (
					<OText
						color={colors.white}
						numberOfLines={1}
						mBottom={8}
						style={{...props?.subtitleStyle}}
						size={18}
						weight="400"
					>
						{props.subtitle}
					</OText>
				)}

				<OText
					color={colors.white}
					mLeft={0}
					size={32}
					numberOfLines={1}
					mBottom={8}
					style={{...props?.titleStyle}}
					weight="bold"
				>
					{props.title}
				</OText>

				{props?.description && (
					<OText
						color={colors.white}
						numberOfLines={2}
						mBottom={4}
						size={18}
						style={{...props?.descriptionStyle}}
						weight="400"
					>
						{props.description}
					</OText>
				)}
			</CardBody>
		</CardContainer>
	);
}

interface Props {
	onPress?(): void;
	image: string | { uri: string };
	title: string;
	titleStyle?: TextStyle;
	subtitle: string;
	subtitleStyle?: TextStyle;
	description?: string;
	descriptionStyle?: TextStyle;
	style?: ViewStyle;
}

export default PromoCard;
