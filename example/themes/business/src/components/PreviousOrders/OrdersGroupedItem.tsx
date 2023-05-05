import React, { useState } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { useTheme } from 'styled-components/native';
import { useLanguage, useUtils } from 'ordering-components/native'
import FastImage from 'react-native-fast-image'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import {
  AccordionSection,
  Accordion,
  ContentInfo,
  AccordionContent,
  ProductOptionsList
} from './styles'

import { OText } from '../shared';

export const OrdersGroupedItem = (props: any) => {
  const { groupId, orders } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ parseDate }] = useUtils();
  const [isActive, setActiveState] = useState(false)

  const styles = StyleSheet.create({
    productImage: {
      borderRadius: 7.6,
      width: 60,
      height: 60
    },
    logo: {
      borderRadius: 10,
      shadowColor: "#0000006e",
      shadowRadius: 10,
      elevation: 15,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 3,
      height: 65,
      width: 65
    },
    title: {
      marginBottom: 2,
      fontWeight: '600',
      fontSize: 16,
      color: theme.colors.textGray,
    },
    orderlength: {
      marginBottom: 2,
      fontSize: 12,
    },
  })

  return (
    <AccordionSection>
      <Accordion
        activeOpacity={1}
        onPress={() => setActiveState(!isActive)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <ContentInfo>
            <View style={styles.logo}>
              <FastImage
                style={styles.productImage}
                source={theme.images.general.ordersGroup}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 5, flexDirection: 'column' }}>
              <View>
                <OText numberOfLines={1} style={styles.title}>
                  {t('GROUP_NRO', 'Group No.')}{groupId}
                </OText>
              </View>
              <OText
                style={styles.orderlength}
                color={theme.colors.unselectText}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {orders.length}{' '}{t('ORDERS', 'Orders')}
              </OText>
              <OText
                style={styles.orderlength}
                color={theme.colors.unselectText}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {orders[0]?.delivery_datetime_utc
                  ? parseDate(orders[0]?.delivery_datetime_utc)
                  : parseDate(orders[0]?.delivery_datetime, { utc: false })}
              </OText>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-end', maxWidth: 100 }}>
              <View style={{ flexDirection: 'row' }}>
                <MaterialCommunityIcon name={isActive ? 'chevron-up' : 'chevron-down'} size={18} />
              </View>
            </View>
          </ContentInfo>
        </View>
      </Accordion>

      <View style={{ display: isActive ? 'flex' : 'none' }}>
        <Animated.View>
          <AccordionContent>
            <ProductOptionsList>
              {props.children}
            </ProductOptionsList>
          </AccordionContent>
        </Animated.View>
      </View>
    </AccordionSection>
  )
}
