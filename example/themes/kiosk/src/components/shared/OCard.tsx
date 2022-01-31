import React from 'react';
import { TextStyle, ViewStyle, Platform } from 'react-native';
import { useTheme } from 'styled-components/native';

import styled from 'styled-components/native';
import OImage from './OImage';
import OText from './OText';

const CardContainer = styled.TouchableOpacity`
	width: 21%;
	margin: 10px 20px;
	overflow: hidden;
`

const CardBody = styled.View`
	padding: 4%;
`

const CardBadge = styled.Text`
	padding: 2% 4%;
	position: absolute;
	background-color: ${(props: any) => props.theme.theme.colors.primary};
	z-index: 100;
	border-radius: 5px;
	color: #fff;
	font-weight: bold;
	margin: 10px 0;
`

const OCard = (props: Props): React.ReactElement => {
	const theme = useTheme()

	return (
		<CardContainer
		 style={{...props.style}}
		 onPress={props?.onPress}
		 disabled={!props?.onPress}
     activeOpacity={1}
		>
			{props?.badgeText && (
				<CardBadge>
					{props?.badgeText}
				</CardBadge>
			)}
			<OImage
				source={props.image}
				height={120}
				resizeMode="cover"
				borderRadius={16}
			/>
			<CardBody>
				<OText
					mLeft={0}
					size={18}
					numberOfLines={2}
					mBottom={8}
					style={{...props?.titleStyle}}
				>
					{props.title}
				</OText>

				{props?.description && (
					<OText
						color={theme.colors.mediumGray}
						numberOfLines={3}
						mBottom={8}
						style={{...props?.descriptionStyle}}
					>
						{props.description}
					</OText>
				)}
				
				{props?.price && (
					<OText>
						<OText
							color={theme.colors.primary}
							weight="bold"
						>
							{props.price}
						</OText>

						<OText
							color={theme.colors.mediumGray}
							size={12}
							style={{textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}
						>
							{props?.prevPrice ? `  ${props?.prevPrice}  ` : ''}
						</OText>
					</OText>
				)}

			</CardBody>
		</CardContainer>
	);
}

interface Props {
	badgeText?: string;
	onPress?(): void;
	image: string | { uri: string };
	title: string;
	titleStyle?: TextStyle;
	description?: string;
	descriptionStyle?: TextStyle;
	price?: string;
	prevPrice?: string;
	style?: ViewStyle;
}

export default OCard;
