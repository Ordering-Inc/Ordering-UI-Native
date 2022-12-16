import React, { useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useLanguage, useUtils } from 'ordering-components/native'

import {
  ReviewOrderContainer,
  BusinessLogo,
  FormReviews,
  ActionContainer,
  RatingStarContainer,
  PlacedDate,
  MultiLogosContainer
} from './styles'
import { OButton, OIcon, OText } from '../shared'
import { StyleSheet, View, I18nManager } from 'react-native';
import { FloatingBottomContainer } from '../../layouts/FloatingBottomContainer'

import { useTheme } from 'styled-components/native'

export const ReviewTrigger = (props: any) => {
  const {
    order,
    handleOpenOrderReview
  } = props

  const theme = useTheme()

  const styles = StyleSheet.create({
    logoWrapper: {
      shadowColor: theme.colors.black,
      shadowRadius: 3,
      shadowOffset: { width: 1, height: 4 },
      elevation: 3,
      borderRadius: 8,
      shadowOpacity: 0.1,
      overflow: 'hidden'
    },
    inputTextArea: {
      borderColor: theme.colors.lightGray,
      borderRadius: 8,
      marginTop: 10,
      marginBottom: 40,
      height: 100,
      alignItems: 'flex-start'
    },
    statusBar: {
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
      height: 10,
      borderRadius: 5,
      marginTop: 5
    },
    ratingItemContainer: {
      position: 'absolute',
      top: -20
    },
    ratingItem: {
      left: '-50%',
      flexDirection: 'column',
      alignItems: 'center'
    },
    ratingLineStyle: {
      height: 10,
      width: 1,
      marginBottom: 10,
      backgroundColor: theme.colors.dusk
    },
    reviewedStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 20
    },
  })

  const [, t] = useLanguage()
  const [{ parseDate }] = useUtils()
  const placedOnDate = parseDate(order?.delivery_datetime, { utc: true, outputFormat: 'dddd MMMM DD, YYYY' })
  const [star, setStar] = useState(5)

  return (
    <>
      <ReviewOrderContainer>
        <BusinessLogo>
          {typeof order?.logo === 'string' || !order?.logo ? (
            <View style={styles.logoWrapper}>
              <OIcon
                url={order?.logo}
                width={80}
                height={80}
              />
            </View>
          ) : (
            <MultiLogosContainer>
              {order?.logo?.map((logo : string, i : number) => (
                <React.Fragment key={logo}>
                  <View style={styles.logoWrapper}>
                    <OIcon
                      url={logo}
                      width={80}
                      height={80}
                    />
                  </View>
                </React.Fragment>
              ))}
            </MultiLogosContainer>

          )}
        </BusinessLogo>
        {!!order?.business_name && <OText style={{ textAlign: 'center', marginTop: 15 }} color={theme.colors.textNormal}>{order?.business_name}</OText>}
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <FormReviews>
            <RatingStarContainer>
              {[...Array(5).keys()].map((index: number) => (<FontAwesome name={(index <= (star - 1)) ? 'star' : 'star-o'} size={28} key={`star-symbol-${index}`} onPress={() => setStar(index + 1)} color={theme?.colors?.primary} />)
              )}
            </RatingStarContainer>
            <PlacedDate>
              <OText color={theme.colors.textNormal}>{t('DONOT_FORGET_RATE_YOUR_ORDER', 'Do not forget to rate your order placed on ')}</OText>
              <OText color={theme.colors.textNormal} style={{ fontWeight: "bold" }}>{placedOnDate}</OText>
            </PlacedDate>
          </FormReviews>
        </View>
      </ReviewOrderContainer>
      <FloatingBottomContainer borderTopWidth={0} borderRadius={10}>
        <ActionContainer>
          <OButton
            textStyle={{ color: theme.colors.white, paddingRight: 10 }}
            text={t('GOTO_REVIEW', 'Go to review')}
            style={{ borderRadius: 8 }}
            imgRightSrc={theme.images.general.arrow_right}
            imgRightStyle={{ tintColor: theme.colors.white, right: 5, margin: 5 }}
            onClick={() => handleOpenOrderReview(star)}
          />
        </ActionContainer>
      </FloatingBottomContainer>
    </>
  )
}
