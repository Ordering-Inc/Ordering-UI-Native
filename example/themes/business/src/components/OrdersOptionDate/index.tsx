import React from 'react';
import { useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Container } from './styles';
import ODropDownCalendar from '../shared/ODropDownCalendar';

export const OrdersOptionDate = (props: any) => {
  const {
    search,
    onSearch
  } = props

  const theme = useTheme();
  const [, t] = useLanguage();
  const optionsList: any = [
    { value: 'today', content: t('TODAY', 'Today') },
    { value: 'yesterday', content: t('YESTERDAY', 'Yesterday') },
    { value: 'last_7days', content: t('LAST_7_DAYS', 'Last 7 days') },
    { value: 'last_30days', content: t('LAST_30_DAYS', 'Last 30 days') }
  ]

  const handleChangeOption = (option: any) => {
    if (option === 'calendar') {
      onSearch({...search, date: {...search.date, type: option}})
    } else {
      onSearch({...search, date: {from: '', to: '', type: option}})
    }
  }

  const handleChangeDate = (from: any, to: any) => {
    onSearch({...search, date: {...search.date, from: from, to: to}})
  }

  return (
    <Container>
      <ODropDownCalendar
        options={optionsList}
        defaultValue={search.date.type}
        onSelect={(option: any) => handleChangeOption(option)}
        isModal
        bgcolor={theme.colors.inputDisabled}
        textcolor={theme.colors.unselectText}
        placeholder={t('SELECT_DATE', 'Select Date')}
        dropViewMaxHeight={500}
        isCalendar
        rangeDate={search.date}
        handleChangeDate={handleChangeDate}
      />
    </Container>
  );
};
