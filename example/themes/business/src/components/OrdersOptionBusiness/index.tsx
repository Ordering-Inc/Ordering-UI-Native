import React, { useState, useEffect } from 'react';
import { useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Container } from './styles';
import ODropDown from '../shared/ODropDown';
import { BusinessList as BusinessListController } from 'ordering-components/native'
import { Platform } from 'react-native'

export const OrdersOptionBusinessUI = (props: any) => {
  const {
    search,
    onSearch,
    businessesList
  } = props

  const theme = useTheme();
  const [, t] = useLanguage();
  const [optionsList, setOptionsList] = useState([])

  useEffect(() => {
    const businesses: any = []
    for (const business of businessesList?.businesses) {
      businesses.push({value: business.id, content: business.name})
    }
    setOptionsList(businesses)
  }, [businessesList?.businesses])

  return (
    <Container isIos={Platform.OS === 'ios'}>
      <ODropDown
        options={optionsList}
        defaultValue={search.business}
        onSelect={(option: any) => onSearch({ ...search, business: option })}
        isModal
        bgcolor={theme.colors.inputDisabled}
        textcolor={theme.colors.unselectText}
        placeholder={t('SELECT_BUSINESS', 'Select Business')}
        dropViewMaxHeight={200}
      />
    </Container>
  );
};

export const OrdersOptionBusiness = (props: any) => {
  const ordersOptionBusinessProps = {
    ...props,
    propsToFetch: ['id', 'name'],
    UIComponent: OrdersOptionBusinessUI
  };
  return <BusinessListController {...ordersOptionBusinessProps} />
};
