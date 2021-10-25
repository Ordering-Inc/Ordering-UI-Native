import React from 'react';
import { useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Container } from './styles';
import ODropDown from '../shared/ODropDown';

export const OrdersOptionDelivery = (props: any) => {
  const {
    search,
    onSearch
  } = props

  const theme = useTheme();
  const [, t] = useLanguage();
  const optionsList: any = [
    { value: '1', content: t('DELIVERY', 'Delivery') },
    { value: '2', content: t('PICKUP', 'Pickup') }
  ]

  return (
    <Container>
      <ODropDown
        options={optionsList}
        defaultValue={search.delivery_type}
        onSelect={(option: any) => onSearch({ ...search, delivery_type: option })}
        isModal
        bgcolor={theme.colors.inputDisabled}
        textcolor={theme.colors.unselectText}
        placeholder={t('SELECT_DELIVERY_TYPE', 'Select Delivery type')}
        dropViewMaxHeight={200}
      />
    </Container>
  );
};
