import React from 'react';
import {TouchableOpacity, Platform} from 'react-native';
import {
  useLanguage,
  StorePayments as StorePaymentsController,
} from 'ordering-components/native';
import {useTheme} from 'styled-components/native';
import {Item} from './styles';
import {OText, OIcon} from '../shared';

export const StorePaymentsUI = (props: any) => {
  const {
    paymethodSelected,
    item,
    createPaymentMethod,
    openPaySetup,
    getPayIcon,
    isDisabled,
  } = props;

  const [, t] = useLanguage();
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={() =>
        Platform.OS === 'ios' ? openPaySetup() : createPaymentMethod()
      }>
      <Item
        key={item.id}
        isDisabled={isDisabled}
        isActive={parseInt(paymethodSelected?.id) === parseInt(item?.id)}>
        <OIcon
          src={getPayIcon(item?.gateway)}
          width={40}
          height={40}
          color={
            paymethodSelected?.id === item?.id
              ? theme.colors.white
              : theme.colors.backgroundDark
          }
        />

        <OText
          size={12}
          style={{margin: 0}}
          color={
            paymethodSelected?.id === item?.id
              ? theme.colors.white
              : theme.colors.secundaryContrast
          }>
          {t(item.gateway.toUpperCase(), item?.name)}
        </OText>
      </Item>
    </TouchableOpacity>
  );
};

export const StorePayments = (props: any) => {
  const paymentOptions = {
    ...props,
    platform: Platform.OS,
    UIComponent: StorePaymentsUI,
  };

  return <StorePaymentsController {...paymentOptions} />;
};
