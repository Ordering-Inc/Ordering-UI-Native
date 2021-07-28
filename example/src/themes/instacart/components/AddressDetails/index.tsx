import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { AddressDetails as AddressDetailsController, useOrder } from 'ordering-components/native';

import {
	ADContainer,
	ADHeader,
	ADAddress,
	ADMap
} from './styles';

import { OText, OIcon } from '../shared';

const AddressDetailsUI = (props: any) => {
	const {
		navigation,
		addressToShow,
		isCartPending,
		googleMapsUrl,
		apiKey,
		showMap
	} = props;

	const theme = useTheme();
	const [orderState] = useOrder();

	return (
		<ADContainer>
			<ADHeader>
				{orderState?.options?.type === 1 && !isCartPending &&
					<ADAddress activeOpacity={0.7} onPress={() => navigation.navigate('AddressList', { isFromCheckout: true })}>
						<OIcon
							src={theme.images.general.pin_line}
							width={16}
							color={theme.colors.primary}
							style={{ marginEnd: 5 }}
						/>
						<OText
							size={12}
							numberOfLines={2}
							ellipsizeMode='tail'
						>
							{addressToShow || orderState?.options?.address?.address}
						</OText>
					</ADAddress>
				}
			</ADHeader>
			{showMap && !!apiKey && googleMapsUrl && (
				<ADMap>
					<OIcon
						url={googleMapsUrl}
						style={{ borderRadius: 15, width: '100%' }}
						height={162}
					/>
				</ADMap>
			)}
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
