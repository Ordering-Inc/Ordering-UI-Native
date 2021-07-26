import * as React from 'react';
import { useFocusEffect } from '@react-navigation/native'
import styled from 'styled-components/native';
import { useOrder } from 'ordering-components/native';
import { Platform } from 'react-native';
import { Container } from '../layouts/Container'
import { OrderSummary } from '../themes/instacart/components/OrderSummary';
import { useEffect } from 'react';

const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
`;

interface Props {
	navigation?: any;
	route?: any;
	cart?: any;
}

const CartPage = (props: Props) => {
	const { navigation, route, cart } = props;
	const cartProps = {
		...props,
		cart: route.params.cart,
		isCartPending: route.params.cart?.status === 2,
		isFromCheckout: true,
		onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params)
	}

	useEffect(() => {
		console.log(cart);
	}, [])

	return (
		<>
			<KeyboardView
				enabled
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<Container>
					<OrderSummary {...cartProps} />
				</Container>
			</KeyboardView>
		</>
	);
};

export default CartPage;
