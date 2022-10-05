import React, { useState, useEffect } from 'react';
import { useLanguage, PaymethodList as PyamethodListControllder } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Container } from './styles';
import ODropDown from '../shared/ODropDown';
import { Platform } from 'react-native'

export const OrdersOptionPaymethodUI = (props: any) => {
  const {
    search,
    onSearch,
    paymethodList,
    setOpenedSelect,
    openedSelect
  } = props

  const theme = useTheme();
  const [, t] = useLanguage();
  const [optionsList, setOptionsList] = useState([])

  useEffect(() => {
    const paymethods: any = []
    for (const paymethod of paymethodList?.paymethods) {
      paymethods.push({value: paymethod.id, content: paymethod.name})
    }
    setOptionsList(paymethods)
  }, [paymethodList?.paymethods])

  const handleClear = () => {
    onSearch({ ...search, paymethod: '' })
  }

  const handleOpenSelect = () => {
    setOpenedSelect('paymethod')
  }

  return (
    <Container isIos={Platform.OS === 'ios'}>
      <ODropDown
        options={optionsList}
        defaultValue={search.paymethod}
        onSelect={(option: any) => onSearch({ ...search, paymethod: option })}
        isModal
        bgcolor={theme.colors.inputDisabled}
        textcolor={theme.colors.unselectText}
        placeholder={t('SELECT_PAYMETHOD', 'Select Paymethod')}
        dropViewMaxHeight={200}
        handleClear={handleClear}
        handleOpenSelect={handleOpenSelect}
        openedSelect={openedSelect}
        selectType='paymethod'
      />
    </Container>
  );
};

export const OrdersOptionPaymethod = (props: any) => {
  const ordersOptionPaymethodProps = {
    ...props,
    UIComponent: OrdersOptionPaymethodUI
  };
  return <PyamethodListControllder {...ordersOptionPaymethodProps} />;
};
