import React from 'react';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import {
  useUtils,
  useLanguage,
  useOrder
} from 'ordering-components/native'

import { useTheme } from 'styled-components/native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { OIcon, OText } from '../shared';
import { convertHoursToMinutes } from '../../utils';

import {
  Card,
  BusinessContent,
  BusinessInfo,
  BusinessActions,
  Metadata,
  Reviews,
  BtnWrapper
} from './styles'

export const BusinessCart = (props: any) => {
  const {
    business,
    isLoading,
    isDisabled,
    isSkeleton,
    handleCartStoreClick
  } = props

  const [, t] = useLanguage()
  const theme = useTheme();
  const [orderState] = useOrder()
  const [{ parsePrice, parseDistance, parseNumber }] = useUtils();

  const styles = StyleSheet.create({
    starIcon: {
      marginHorizontal: 2,
      marginTop: -5,
    },
    bullet: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  });

  return (
    <Card>
      <BusinessContent>
        <BusinessInfo>
          {business?.name && (
            <OText
              size={12}
              weight={'500'}>
              {business?.name}
            </OText>
          )}
          {isSkeleton && (
            <Placeholder
              Animation={Fade}
              style={{ marginBottom: 5 }}
            >
              <PlaceholderLine
                height={10}
                width={40}
                style={{ marginBottom: 5 }}
              />
            </Placeholder>
          )}
          {!!business?.address && (
            <OText
              size={10}
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={{ marginBottom: 5 }}
            >
              {business?.address}
            </OText>
          )}
          {isSkeleton && (
            <Placeholder
              Animation={Fade}
              style={{ marginBottom: 5 }}
            >
              <PlaceholderLine
                height={10}
                width={80}
                style={{ marginBottom: 5 }}
              />
            </Placeholder>
          )}
          <Metadata>
            {!isSkeleton ? (
              <View style={styles.bullet}>
                <OText size={10} color={theme.colors.textSecondary}>
                  {`${t('DELIVERY_FEE', 'Delivery fee')} ${parsePrice(business?.delivery_price) + ' \u2022 '}`}
                </OText>
                <OText size={10} color={theme.colors.textSecondary}>{`${convertHoursToMinutes(
                  orderState?.options?.type === 1
                    ? business?.delivery_time
                    : business?.pickup_time,
                )} \u2022 `}</OText>
                <OText size={10} color={theme.colors.textSecondary}>{parseDistance(business?.distance)}</OText>
              </View>
            ) : (
              <Placeholder
                Animation={Fade}
                style={{ marginBottom: 5 }}
              >
                <PlaceholderLine
                  height={10}
                  width={60}
                  style={{ marginBottom: 5 }}
                />
              </Placeholder>
            )}
          </Metadata>
        </BusinessInfo>
        <BusinessActions>
          {business?.reviews?.total > 0 && (
            <Reviews>
              <OIcon src={theme.images.general.star} width={12} style={styles.starIcon} />
              <OText size={10} style={{ lineHeight: 15 }}>
                {parseNumber(business?.reviews?.total ?? 1, { separator: '.' })}
              </OText>
            </Reviews>
          )}
          <BtnWrapper>
          {handleCartStoreClick && (
            <TouchableOpacity
              activeOpacity={1}
              disabled={isDisabled}
              onPress={() => handleCartStoreClick && handleCartStoreClick(business?.id)}
              style={{
                backgroundColor: isDisabled ? theme.colors.disabled : theme.colors.white,
                borderColor: isDisabled ? theme.colors.disabled : theme.colors.primary,
                justifyContent: 'center',
                position: 'relative',
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: 10,
                paddingLeft: 10,
                borderRadius: 7.6,
                borderWidth: 1,
                height: 30,
              }}
            >
              <OText
                style={{
                  color: isDisabled ? theme.colors.white : theme.colors.primary,
                  fontSize: 12,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : (
                  t('SELECT', 'Select')
                )}
              </OText>
            </TouchableOpacity>
          )}
          {isSkeleton && (
            <Placeholder
              Animation={Fade}
              style={{ marginBottom: 5 }}
            >
              <PlaceholderLine
                height={30}
                width={80}
                style={{ marginBottom: 5 }}
              />
            </Placeholder>
          )}
          </BtnWrapper>
        </BusinessActions>
      </BusinessContent>
    </Card>
  )
}
