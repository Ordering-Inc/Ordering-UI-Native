import React from 'react';
import { Dimensions, View } from 'react-native';
import { useLanguage } from 'ordering-components/native';

import { Container } from '../layouts/Container';
import OImage from '../components/shared/OImage';
import OButton from '../components/shared/OButton';
import { LanguageSelector } from '../components/LanguageSelector';
import { GENERAL_IMAGES, LOGO_IMAGES } from '../config/constants'

const IntroPage = () => {
	const [, t] = useLanguage()

  return (
		<Container>
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
					width={(_dim.width * 0.65) - _offset}
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
				/>

				<LanguageSelector />
			</View>
		</Container>
	);
};

const _dim = Dimensions.get('window');
const _offset = 50;

export default IntroPage;
