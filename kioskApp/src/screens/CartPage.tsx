import * as React from 'react';
import styled from 'styled-components/native';
import { useOrder, useLanguage } from 'ordering-components/native';
import { Platform } from 'react-native';
import { colors } from '../theme.json'
import { CartContent } from '../components/CartContent';
import { Container } from '../layouts/Container'
import NavBar from '../components/NavBar';
import { OButton } from '../components/shared';

const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
`;

interface Props {
  navigation: any;
  route: any;
}

const CartPage = (props: Props) => {
  const [{ carts }] = useOrder();
  const cartsList = (carts && Object.values(carts).filter((cart: any) => cart.products.length > 0)) || []
  
  const [, t] = useLanguage();

  const cartProps = {
    ...props,
    carts: cartsList,
    isOrderStateCarts: !!carts,
    onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params)
  }

  const onCancelOrder = () => {
		console.log('Cancel order');
	};
	
	const goToBack = () => props.navigation.goBack();

  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Container>
        <NavBar
          title={t('CONFIRM_YOUR_ORDER', 'Confirm your order')}
          onActionLeft={goToBack}
          rightComponent={(
            <OButton
              text={t('CANCEL_ORDER', 'Cancel order')}
              bgColor="transparent"
              borderColor="transparent"
              textStyle={{ color: colors.primary }}
              onClick={onCancelOrder}
            />
          )}
        />
        <CartContent {...cartProps} />
      </Container>
    </KeyboardView>
  );
};

export default CartPage;
