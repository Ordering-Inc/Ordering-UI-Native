import React, { useState, useEffect } from 'react';
import { useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Container } from './styles';
import ODropDown from '../shared/ODropDown';
import { DriverList as DriverListControllder } from './naked'

export const OrdersOptionDriverUI = (props: any) => {
  const {
    search,
    onSearch,
    driverList
  } = props

  const theme = useTheme();
  const [, t] = useLanguage();
  const [optionsList, setOptionsList] = useState([])

  useEffect(() => {
    const drivers: any = []
    for (const driver of driverList?.drivers) {
      drivers.push({value: driver.id, content: driver.name})
    }
    setOptionsList(drivers)
  }, [driverList?.drivers])

  return (
    <Container>
      <ODropDown
        options={optionsList}
        defaultValue={search.driver}
        onSelect={(option: any) => onSearch({ ...search, driver: option })}
        isModal
        bgcolor={theme.colors.inputDisabled}
        textcolor={theme.colors.unselectText}
        placeholder={t('SELECT_DRIVER', 'Select Driver')}
      />
    </Container>
  );
};

export const OrdersOptionDriver = (props: any) => {
  const ordersOptionDriverProps = {
    ...props,
    propsToFetch: ['id', 'name', 'lastname'],
    UIComponent: OrdersOptionDriverUI
  };
  return <DriverListControllder {...ordersOptionDriverProps} />;
};
