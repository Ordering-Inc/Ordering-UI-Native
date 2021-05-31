import React from 'react';
import { Dimensions, View } from 'react-native';

import { Container } from '../layouts/Container';
import OImage from '../components/shared/OImage';
import OButton from '../components/shared/OButton';

const IntroPage = () => {
  return (
		<Container>
			<View
				style={{
					height: _dim.height - _offset,
					justifyContent: 'space-around',
					alignItems: 'center'
				}}
			>
				<OImage
					source={require('../assets/images/logo.png')}
					width={_dim.width - _offset}
					height={_dim.height * 0.1}
				/>
				
				<OImage
					source={require('../assets/images/burger.png')}
					width={_dim.width}
					height={_dim.height * 0.6}
				/>

				<OButton
					text="Touch to order"
					parentStyle={{
						alignItems: 'center',
						width: _dim.width - _offset
					}}
				/>
			</View>
		</Container>
	);
};

const _dim = Dimensions.get('window');
const _offset = 50;

export default IntroPage;
