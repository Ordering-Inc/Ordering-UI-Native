import React from 'react';
import { TextStyle, TouchableOpacity, View } from 'react-native';
import { AddressDetails as AddressDetailsController, useOrder } from 'ordering-components/native';

import {
	ADContainer,
	ADHeader,
	ADAddress,
	ADMap
} from './styles';

import { OText, OIcon } from '../shared';
import { useTheme } from 'styled-components/native'

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

	const theme = useTheme();

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
				{title ? <OText style={theme.labels.middle as TextStyle}>{title}</OText> : null}
				<ADAddress>
					<OText
						numberOfLines={1}
						ellipsizeMode='tail'
						style={{ width: '85%', ...theme.labels.normal } as TextStyle}
					>
						{addressToShow || orderState?.options?.address?.address}
					</OText>
					<View>
						{orderState?.options?.type === 1 && !isCartPending &&
							<TouchableOpacity onPress={() => navigation.navigate('AddressList', { isFromCheckout: true })}>
								<OIcon src={theme.images.general.pencil} width={16} color={theme.colors.textSecondary} />
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
