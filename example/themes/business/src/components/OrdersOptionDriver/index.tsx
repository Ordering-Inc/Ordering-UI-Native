import React, { useState, useEffect } from 'react';
import { useLanguage, DriverList as DriverListControllder } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Container } from './styles';
import ODropDown from '../shared/ODropDown';
import { Platform } from 'react-native'

export const OrdersOptionDriverUI = (props: any) => {
  const {
    search,
    onSearch,
    driverList,
    setOpenedSelect,
    openedSelect
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

  const handleClear = () => {
    onSearch({ ...search, driver: '' })
  }

  const handleOpenSelect = () => {
    setOpenedSelect('driver')
  }

  return (
    <Container isIos={Platform.OS === 'ios'}>
      <ODropDown
        options={optionsList}
        defaultValue={search.driver}
        onSelect={(option: any) => onSearch({ ...search, driver: option })}
        isModal
        bgcolor={theme.colors.inputDisabled}
        textcolor={theme.colors.unselectText}
        placeholder={t('SELECT_DRIVER', 'Select Driver')}
        dropViewMaxHeight={165}
        handleClear={handleClear}
        handleOpenSelect={handleOpenSelect}
        openedSelect={openedSelect}
        selectType='driver'
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
