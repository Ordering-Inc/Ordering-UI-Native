import React from 'react';
import { Dimensions, View } from 'react-native';
import { useLanguage } from 'ordering-components/native';

import { Container } from '../layouts/Container';
import NavBar from '../components/NavBar';
import { OText } from '../components/shared';
import DeliveryTypeCard from '../components/DeliveryTypeCard';
import { DELIVERY_TYPE_IMAGES, IMAGES } from '../config/constants';

const DeliveryTypePage = () => {
	const [, t] = useLanguage()

  return (
		<Container>
			<NavBar
				title={t('DELIVERY_TYPE', 'Delivery Type')}
			/>

			<View style={{ marginVertical: _dim.height * 0.03 }}>
				<OText
					size={_dim.width * 0.09}
				>
					{t('WHERE_WILL_YOU_BE', 'Where will you be')} {'\n'}
					<OText
						size={_dim.width * 0.09}
						weight={'700'}
					>
						{t('EATING_TODAY?', 'eating today?')}
					</OText>
				</OText>
			</View>

			<DeliveryTypeCard
				title={t('EAT_IN','Eat In')}
				description={t('EAT_IN_DESCRIPTION', 'We are very glad to have you here. Bon appetit!')}
				bgImage={DELIVERY_TYPE_IMAGES.eatIn}
				icon={IMAGES.pushPin}
				callToActionText={t('START_MY_ORDER', 'Start my order')}
				onClick={() => {
					console.log('Eat in')
				}}
			/>

			<View style={{ height: _dim.height * 0.02 }} />

			<DeliveryTypeCard
				title={t('TAKE_OUT','Take out')}
				description={t('TAKE_OUT_DESCRIPTION', 'You are very welcome anytime you visit us!')}
				bgImage={DELIVERY_TYPE_IMAGES.takeOut}
				icon={IMAGES.shoppingCart}
				callToActionText={t('START_MY_ORDER', 'Start my order')}
				onClick={() => {
					console.log('Take out')
				}}
			/>

			<View style={{ height: _dim.height * 0.05 }} />

		</Container>
	);
};

const _dim = Dimensions.get('window');

export default DeliveryTypePage;
