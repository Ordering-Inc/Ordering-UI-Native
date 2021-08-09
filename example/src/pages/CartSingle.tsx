import * as React from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { Container } from '../themes/instacart'
import { CartSingle } from '../themes/instacart';

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
