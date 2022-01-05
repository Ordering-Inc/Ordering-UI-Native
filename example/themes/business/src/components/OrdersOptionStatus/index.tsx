import React, { useState, useEffect } from 'react';
import { useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Container } from './styles';
import ODropDown from '../shared/ODropDown';
import { Platform } from 'react-native'

export const OrdersOptionStatus = (props: any) => {
  const {
    currentTabSelected,
    tabs,
    orderStatus,
    search,
    onSearch
  } = props

  const theme = useTheme();
  const [, t] = useLanguage();
  const [optionsList, setOptionsList] = useState([])

  useEffect(() => {
    if (!currentTabSelected || tabs?.length === 0 || orderStatus?.length === 0) return
    const currentTab = tabs?.find((tab: any) => tab.title === currentTabSelected)
    const _optionList: any = []
    for (const tag of currentTab?.tags) {
      const status = orderStatus.find((status: any) => status.key === tag)
      _optionList.push({value: tag, content: status.text})
    }
    setOptionsList(_optionList)
  }, [currentTabSelected, tabs, orderStatus])

  return (
    <Container isIos={Platform.OS === 'ios'}>
      <ODropDown
        options={optionsList}
        defaultValue={search.state}
        onSelect={(option: any) => onSearch({ ...search, state: option })}
        isModal
        bgcolor={theme.colors.inputDisabled}
        textcolor={theme.colors.unselectText}
        placeholder={t('SELECT_STATUS', 'Select Status')}
        dropViewMaxHeight={200}
      />
    </Container>
  );
};
