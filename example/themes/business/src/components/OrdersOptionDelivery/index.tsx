import React from 'react';
import { useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Container } from './styles';
import ODropDown from '../shared/ODropDown';
import { Platform } from 'react-native'

export const OrdersOptionDelivery = (props: any) => {
  const {
    search,
    onSearch,
    setOpenedSelect,
    openedSelect
  } = props

  const theme = useTheme();
  const [, t] = useLanguage();
  const optionsList: any = [
    { value: '1', content: t('DELIVERY', 'Delivery') },
    { value: '2', content: t('PICKUP', 'Pickup') }
  ]

  const handleClear = () => {
    onSearch({ ...search, delivery_type: '' })
  }

  const handleOpenSelect = () => {
    setOpenedSelect('delivery_type')
  }

  return (
    <Container isIos={Platform.OS === 'ios'}>
      <ODropDown
        options={optionsList}
        defaultValue={search.delivery_type}
        onSelect={(option: any) => onSearch({ ...search, delivery_type: option })}
        isModal
        bgcolor={theme.colors.inputDisabled}
        textcolor={theme.colors.unselectText}
        placeholder={t('SELECT_DELIVERY_TYPE', 'Select Delivery type')}
        dropViewMaxHeight={200}
        handleClear={handleClear}
        handleOpenSelect={handleOpenSelect}
        openedSelect={openedSelect}
        selectType='delivery_type'
      />
    </Container>
  );
};
