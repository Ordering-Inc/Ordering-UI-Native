import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
	AddressDetails as AddressDetailsController,
	useOrder,
	useLanguage,
} from 'ordering-components/native';

import { ADContainer, ADHeader, ADAddress, ADMap } from './styles';

import { useTheme } from 'styled-components/native';
import { OText, OIcon } from '../shared';
import { useWindowDimensions } from 'react-native';

const AddressDetailsUI = (props: any) => {
	const { navigation, addressToShow, isCartPending, googleMapsUrl, apiKey } =
		props;

	const theme = useTheme();
	const [orderState] = useOrder();
	const [, t] = useLanguage();
	const { width } = useWindowDimensions();

	return (
		<ADContainer>
			<ADHeader>
				<OText
					size={16}
					lineHeight={24}
					color={theme.colors.textNormal}
				>
					{t('DELIVERY_ADDRESS', 'Delivery address')}
				</OText>
			</ADHeader>
			{!!apiKey && (
				<ADMap
					style={{ marginStart: -40, marginEnd: -40, width: width, flex: 1 }}>
					<OIcon url={googleMapsUrl} height={151} width={width} />
				</ADMap>
			)}
			<ADAddress>
				<OText
					size={12}
					color={theme.colors.textNormal}
					numberOfLines={1}
					ellipsizeMode="tail"
					style={{ width: '85%' }}>
					{addressToShow || orderState?.options?.address?.address}
				</OText>
				<OText size={12} lineHeight={18} color={theme.colors.textNormal}>
					{orderState?.options?.address?.address_notes}
				</OText>
				{orderState?.options?.type === 1 && !isCartPending && (
					<TouchableOpacity
						onPress={() =>
							navigation.navigate('AddressList', { isFromCheckout: true })
						}>
						<OText
							size={12}
							color={theme.colors.primary}
							style={{ textDecorationLine: 'underline' }}>
							{t('CHANGE', 'Change')}
						</OText>
					</TouchableOpacity>
				)}
			</ADAddress>
		</ADContainer>
	);
};

export const AddressDetails = (props: any) => {
	const addressDetailsProps = {
		...props,
		UIComponent: AddressDetailsUI,
	};
	return <AddressDetailsController {...addressDetailsProps} />;
};
