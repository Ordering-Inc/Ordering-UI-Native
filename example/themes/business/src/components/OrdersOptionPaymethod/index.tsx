import React, { useState, useEffect } from 'react';
import { useLanguage, PaymethodList as PyamethodListControllder } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Container } from './styles';
import ODropDown from '../shared/ODropDown';

export const OrdersOptionPaymethodUI = (props: any) => {
  const {
    search,
    onSearch,
    paymethodList
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

  return (
    <Container>
      <ODropDown
        options={optionsList}
        defaultValue={search.paymethod}
        onSelect={(option: any) => onSearch({ ...search, paymethod: option })}
        isModal
        bgcolor={theme.colors.inputDisabled}
        textcolor={theme.colors.unselectText}
        placeholder={t('SELECT_PAYMETHOD', 'Select Paymethod')}
        dropViewMaxHeight={200}
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
