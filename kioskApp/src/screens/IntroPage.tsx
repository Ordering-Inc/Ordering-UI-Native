import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
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

	const _dim = Dimensions.get('window');

	const [, t] = useLanguage();
	const [refreshing] = useState(false);
	const [showLogoutPopup, setShowLogoutPopup] = useState(false);

	const [isPortrait, setPortrait] = useState(_dim.width < _dim.height);

	const goBusiness = () => {
		navigation.navigate('DeliveryType', {
				callback: () => {
					navigation.navigate('Business');
				},
				goBack: () => {
					navigation.goBack();
				},
			}
		);
	};

	const onShowLogout = () => {
		setShowLogoutPopup(true);
	};

	const onHideLogout = () => {
		setShowLogoutPopup(false);
	};

	const onLogoutDone = () => {
		navigation.reset({
			routes: [{ name: 'Login' }]
		});
	};

	useEffect(() => {
		Dimensions.addEventListener('change', ({ window: { width, height } }) => {
			setPortrait(width < height);
		})
	}, []);

  return (
		<FlatList
			refreshing={refreshing}
			onRefresh={onShowLogout}
			scrollEnabled={false}
			data={[1]}
			keyExtractor={item => `${item}`}
			renderItem={() => {
				return (
					<Container nopadding={ !isPortrait }>
						{ isPortrait ?
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
									onClick={goBusiness}
								/>

								<LanguageSelector/>
							</View>
							:
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'flex-start',
									alignItems: 'center',
									padding: 0,
									margin: 0
								}}
							>
								<OImage
									source={GENERAL_IMAGES.homeLandHero}
									width={_dim.width * 0.40}
									height={_dim.height}
									resizeMode={'cover'}
								/>

								<View
									style={{
										height: _dim.height,
										width: '50%',
										justifyContent: 'space-around',
										alignItems: 'center',
										paddingBottom: '5%',
										paddingTop: '10%',
									}}
								>
									<OImage
										source={LOGO_IMAGES.logotype}
										width={(_dim.width * 0.4) - _offset}
										height={_dim.height * 0.1}
									/>

									<View style={{
										justifyContent: 'space-around',
										alignItems: 'center'
									}}>

										<OButton
											style={styles.buttonLandStyle}
											text={t('TOUCH_TO_ORDER', 'Touch to order')}
											parentStyle={{
												alignItems: 'center',
												width: _dim.width - _offset
											}}
											onClick={goBusiness}
										/>

										<LanguageSelector />
									</View>
								</View>
							</View>
						}

						<LogoutPopup
							open={showLogoutPopup}
							onClose={onHideLogout}
							onLogoutDone={onLogoutDone}
						/>
					</Container>
				);
			}}
		/>
	);
};

const styles = StyleSheet.create({
	buttonLandStyle: {
		width: 260,
		marginBottom: 16
	}
});

const _offset = 50;

export default IntroPage;
