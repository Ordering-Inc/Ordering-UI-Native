import React from 'react';
import { TextStyle, TouchableOpacity, View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AddressDetails as AddressDetailsController, useOrder } from 'ordering-components/native';

import {
	ADContainer,
	ADHeader,
	ADAddress,
	ADMap
} from './styles';

import { colors, labels, images } from '../../theme.json'
import { OText, OIcon } from '../../../../components/shared';

const AddressDetailsUI = (props: any) => {
	const {
		navigation,
		addressToShow,
		isCartPending,
		googleMapsUrl,
		apiKey,
		title
	} = props;

	const [orderState] = useOrder();

	return (
		<ADContainer>
			<ADHeader>
				{!!apiKey && googleMapsUrl && (
					<ADMap>
						<OIcon
							url={googleMapsUrl}
							style={{ borderRadius: 7.6, width: '100%', resizeMode: 'cover' }}
							height={110}
						/>
					</ADMap>
				)}
				{title ? <OText style={labels.middle as TextStyle}>{title}</OText> : null}
				<ADAddress>
					<OText
						numberOfLines={1}
						ellipsizeMode='tail'
						style={{ width: '85%', ...labels.normal } as TextStyle}
					>
						{addressToShow || orderState?.options?.address?.address}
					</OText>
					<View>
						{orderState?.options?.type === 1 && !isCartPending &&
							<TouchableOpacity onPress={() => navigation.navigate('AddressList', { isFromCheckout: true })}>
								<OIcon src={images.general.pencil} width={16} color={colors.textSecondary} />
							</TouchableOpacity>
						}
					</View>
				</ADAddress>
			</ADHeader>

		</ADContainer>
	)
}

export const AddressDetails = (props: any) => {
	const addressDetailsProps = {
		...props,
		UIComponent: AddressDetailsUI
	}
	return (
		<AddressDetailsController {...addressDetailsProps} />
	)
}
