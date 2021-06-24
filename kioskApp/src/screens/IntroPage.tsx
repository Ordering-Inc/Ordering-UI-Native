import React, { useState } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import { useLanguage } from 'ordering-components/native';

import { Container } from '../layouts/Container';
import OImage from '../components/shared/OImage';
import OButton from '../components/shared/OButton';
import { LanguageSelector } from '../components/LanguageSelector';
import { GENERAL_IMAGES, LOGO_IMAGES } from '../config/constants'
import { LogoutPopup } from '../components/LogoutPopup';

const IntroPage = (props: any): React.ReactElement => {
	const {
    navigation,
  } = props;

	const [, t] = useLanguage()
	const [refreshing] = useState(false);
	const [showLogoutPopup, setShowLogoutPopup] = useState(false);

	const onShowLogout = () => {
		setShowLogoutPopup(true);
	}

	const onHideLogout = () => {
		setShowLogoutPopup(false);
	}

  return (
		<FlatList
			refreshing={refreshing}
			onRefresh={onShowLogout}
			scrollEnabled={false}
			data={[1]}
			renderItem={() => {
				return (
					<Container key="1">
						<View
							style={{
								height: _dim.height - _offset,
								padding: 4,
								justifyContent: 'space-around',
								alignItems: 'center'
							}}
						>
							<OImage
								source={LOGO_IMAGES.logotype}
								width={(_dim.width * 0.4) - _offset}
								height={_dim.height * 0.1}
							/>
							
							<OImage
								source={GENERAL_IMAGES.homeHero}
								width={_dim.width}
								height={_dim.height * 0.6}
							/>

							<OButton
								text={t('TOUCH_TO_ORDER', 'Touch to order')}
								parentStyle={{
									alignItems: 'center',
									width: _dim.width - _offset
								}}
								onClick={() => {
									navigation.navigate('DeliveryType', {
											callback: () => {
												navigation.navigate('Business');
											},
											goBack: () => {
												navigation.goBack();
											},
										}
									);
								}}
							/>

							<LanguageSelector />
						</View>
						
						<LogoutPopup
							open={showLogoutPopup}
							onClose={onHideLogout}
							onLogoutDone={() => {
								navigation.reset({
									routes: [{ name: 'Login' }]
								});
							}}
						/>
					</Container>
				);
			}}
		/>
	);
};

const _dim = Dimensions.get('window');
const _offset = 50;

export default IntroPage;
