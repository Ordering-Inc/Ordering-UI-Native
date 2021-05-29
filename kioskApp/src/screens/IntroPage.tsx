import React from 'react';
import { Dimensions } from 'react-native';

import { Container } from '../layouts/Container';
import OImage from '../components/shared/OImage';
import OButton from '../components/shared/OButton';

const IntroPage = () => {
  return (
		<Container>

			<OImage
				source={require('../assets/images/logo.png')}
				width={_dim.width}
				height={_dim.height * 0.1}
      />
			
			<OImage
				source={require('../assets/images/burger.png')}
				width={_dim.width}
				height={_dim.height * 0.6}
      />

			<OButton
				text="Touch to order"
				style={{ width: _dim.width * 0.5 }}
			/>
			
		</Container>
	);
};

const _dim = Dimensions.get('window');

export default IntroPage;
