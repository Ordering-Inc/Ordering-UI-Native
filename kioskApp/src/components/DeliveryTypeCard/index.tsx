import React from 'react';
import { ImageSourcePropType, ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IMAGES } from '../../config/constants';
import { OButton, OIcon, OText } from '../shared';
import { Container, InnerContainer } from './styles';

const DeliveryTypeCard = (props: Props) => {
	return (
		<TouchableOpacity
			onPress={props.onClick}
		>
			<Container
				source={props.bgImage}
				style={props.style}
			>
				<InnerContainer
					style={props.innerStyle}
				>
					<OIcon
						src={props.icon}
						style={{ marginBottom: 10, ...props?.iconStyle }}
					/>

					<OText
						weight="700"
						color="white"
						size={20}
						mBottom={10}
						style={props.titleStyle}
					>
						{props.title}
					</OText>

					<OText
						color="white"
						mBottom={20}
						style={{ width: 200, ...props?.descriptionStyle }}
					>
						{props.description}
					</OText>

					<OButton
						bgColor="transparent"
						borderColor="transparent"
						text={props.callToActionText}
						textStyle={{
							marginLeft: 0,
							fontWeight: '700',
							...props.callToActionTextStyle,
						}}
						imgRightStyle={{
							position: 'relative',
							left: 8,
							width: 24,
							height: 24,
							...props.callToActionIconStyle,
						}}
						imgRightSrc={props.callToActionIcon}
						style={{ justifyContent: 'flex-start', paddingLeft: 0 }}
					/>
				</InnerContainer>
			</Container>
		</TouchableOpacity>
	);
}

interface Props {
	title: string;
	titleStyle?: TextStyle;
	description: string;
	descriptionStyle?: TextStyle;
  isDisabled?: boolean;
  onClick?: () => void;
	style?: ViewStyle;
  bgImage: ImageSourcePropType;
	innerStyle?: ViewStyle;
  icon: ImageSourcePropType;
	iconStyle?: ImageStyle;
	callToActionText: string;
	callToActionTextStyle?: TextStyle;
	callToActionIcon?: ImageSourcePropType;
	callToActionIconStyle?: ImageStyle;
}

DeliveryTypeCard.defaultProps = {
  callToActionIcon: IMAGES.arrow_right_circular_outlined
};

export default DeliveryTypeCard;
  