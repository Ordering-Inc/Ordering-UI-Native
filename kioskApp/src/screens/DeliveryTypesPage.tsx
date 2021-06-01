import React from 'react';
import { Dimensions, Text } from 'react-native';
import { useLanguage, useApi } from 'ordering-components/native';

import { Container } from '../layouts/Container';
import NavBar from '../components/NavBar';

const DeliveryTypesPage = () => {
	const [, t] = useLanguage()

  return (
		<Container>
			<NavBar />
		</Container>
	);
};

const _dim = Dimensions.get('window');
const _offset = 50;

export default DeliveryTypesPage;
