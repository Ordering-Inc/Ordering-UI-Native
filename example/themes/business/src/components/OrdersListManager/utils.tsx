import React, { useState, useEffect } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { useLanguage, useUtils, useConfig } from 'ordering-components/native'
import styled, { useTheme } from 'styled-components/native'

import { OText, OIcon } from '../shared';

export const useOrderUtils = () => {
  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ parseDate }] = useUtils()

  const calculateDate = (type: any, from: any, to: any) => {
    switch (type) {
      case 'today':
        const date = parseDate(new Date(), { outputFormat: 'MM/DD/YYYY' })
        return { from: `${date} 00:00:00`, to: `${date} 23:59:59` }
      case 'yesterday':
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const start1 = parseDate(yesterday, { outputFormat: 'MM/DD/YYYY' })
        const end1 = parseDate(new Date(), { outputFormat: 'MM/DD/YYYY' })
        return { from: `${start1} 00:00:00`, to: `${end1} 23:59:59` }
      case 'last_7days':
        const last_7days = new Date()
        last_7days.setDate(last_7days.getDate() - 6)
        const start7 = parseDate(last_7days, { outputFormat: 'MM/DD/YYYY' })
        const end7 = parseDate(new Date(), { outputFormat: 'MM/DD/YYYY' })
        return { from: `${start7} 00:00:00`, to: `${end7} 23:59:59` }
      case 'last_30days':
        const last_30days = new Date()
        last_30days.setDate(last_30days.getDate() - 29)
        const start30 = parseDate(last_30days, { outputFormat: 'MM/DD/YYYY' })
        const end30 = parseDate(new Date(), { outputFormat: 'MM/DD/YYYY' })
        return { from: `${start30} 00:00:00`, to: `${end30} 23:59:59` }
      default:
        const start = from ? `${parseDate(from, { outputFormat: 'MM/DD/YYYY' })} 00:00:00` : ''
        const end = to ? `${parseDate(to, { outputFormat: 'MM/DD/YYYY' })} 23:59:59` : ''
        return { from: start, to: end }
    }
  }

  const preorderTypeList = [
    { key: null, name: t('SLA', 'SLA\'s') },
    { key: 'in_time', name: t('OK', 'Ok') },
    { key: 'at_risk', name: t('AT_RISK', 'At Risk') },
    { key: 'delayed', name: t('DELAYED', 'Delayed') }
  ]
  const defaultOrderTypes = [
    { key: 1, name: t('DELIVERY', 'Delivery') },
    { key: 2, name: t('PICKUP', 'Pickup') },
    { key: 3, name: t('EAT_IN', 'Eat in') },
    { key: 4, name: t('CURBSIDE', 'Curbside') },
    { key: 5, name: t('DRIVE_THRU', 'Drive thru') }
  ]

  const deliveryStatus = [
    {
      key: t('OK', 'Ok'),
      des: t('DELIVERY_OK_STATUS_DESC', 'Get delivery time from the businesses.'),
      timmer: false,
      icon: theme.images.general?.clock1,
      backColor: '#00D27A'
    },
    {
      key: t('AT_RISK', 'At risk'),
      des: t('DELIVERY_ATRISK_STATUS_DESC', 'Is the time between delivery time of busines and the delayed time.'),
      timmer: false,
      icon: theme.images.general?.clockRisk,
      backColor: '#FFC700'
    },
    {
      key: t('DELAYED', 'Delayed'),
      des: t('DELIVERY_DELAYED_STATUS_DESC', 'If this time is exceeded, the order will be delayed.'),
      timmer: true,
      icon: theme.images.general?.clockDelayed,
      backColor: '#E63757'
    }
  ]

  const defaultSearchList = {
    id: '',
    state: '',
    city: '',
    business: '',
    delivery_type: '',
    paymethod: '',
    driver: '',
    timeStatus: '',
    date: {
      from: '',
      to: '',
      type: ''
    }
  }

  const constants = {
    preorderTypeList,
    defaultOrderTypes,
    deliveryStatus,
    defaultSearchList,
    calculateDate
  }

  return [constants];
}

export const StatusBlock = (props: any) => {
  const { item, last } = props
  const [showTime, setShowTime] = useState(false)

  useEffect(() => {
    if (last) {
      setShowTime(true)
    }
  }, [last])

  const StatusItems = styled.View`
    position: relative;
    margin-bottom: 20px;
    z-index: 2;
  `
  const ItemHeader = styled.View`
    flex-direction: row;
    margin-bottom: 5px;
  `

  const IconWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    background: #fff;
  `

  const ItemStatus = styled.View`
    width: 4px;
    height: 22px;
    margin: 0 15px;
    border-radius: 4px;
    background: ${(props: any) => props.backColor};
  `

  const ItemContent = styled.View`
    display: flex;
    padding: 0 30px;
  `

  const OverLine = styled.View`
    position: absolute;
    height: 100%;
    width: 15px;
    top: 20px;
    left: 0;
    background-color: #fff;
    z-index: 2;
  `

  return (
    <StatusItems>
      <Pressable style={{ marginBottom: 10 }}>
        <ItemHeader>
          <IconWrapper>
            <OIcon
              src={item?.icon}
              width={16}
              height={16}
              color={item?.backColor}
            />
          </IconWrapper>
          <ItemStatus backColor={item?.backColor} />
          <OText>{item?.key}</OText>
        </ItemHeader>
      </Pressable>
      <ItemContent>
        <OText>{item?.des}</OText>
      </ItemContent>
      {showTime && ( <Timer /> )}
      {last && ( <OverLine /> )}
    </StatusItems>
  )
}

export const Timer = () => {
  const [, t] = useLanguage()
  const theme = useTheme()
  const [{ configs }] = useConfig();

  const styles = StyleSheet.create({
    settingTime: {
      fontSize: 14,
      borderWidth: 1,
      borderRadius: 7.6,
      margin: 0,
      marginRight: 10,
      paddingHorizontal: 10,
      paddingTop: 5,
      borderColor: theme.colors.disabled
    }
  })

  const TimerInputWrapper = styled.View`
    color: ${(props: any) => props.theme.colors.disabled};
    margin-top: 15px;
    margin-left: 30px;
    margin-right: 30px;
    flex-direction: row;
    align-items: flex-end;
  `

  return (
    <TimerInputWrapper>
      <OText style={styles.settingTime} color={theme.colors.disabled}>{configs?.order_deadlines_delayed_time?.value}</OText>
      <OText>{t('TIME_MINUTES', 'min')}</OText>
    </TimerInputWrapper>
  )
}

