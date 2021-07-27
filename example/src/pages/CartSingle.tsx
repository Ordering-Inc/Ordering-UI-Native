import * as React from 'react';
import { useFocusEffect } from '@react-navigation/native'
import styled from 'styled-components/native';
import { useOrder } from 'ordering-components/native';
import { Platform } from 'react-native';
import { Container } from '../layouts/Container'
import { useEffect } from 'react';
import { CartSingle } from '../themes/instacart/components/CartSingle';

const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
`;

interface Props {
	navigation?: any;
	route?: any;
}

const CartSinglePage = (props: Props) => {
	const { navigation, route } = props;
	const cartProps = {
		...props,
		cart: route.params.cart,
		onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params)
	}

	return (
		<>
			<KeyboardView
				enabled
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<Container noScroll>
					<CartSingle {...cartProps} />
				</Container>
			</KeyboardView>
		</>
	);
};

export default CartSinglePage;
