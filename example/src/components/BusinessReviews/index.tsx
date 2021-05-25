import React from 'react'
import { BusinessReviews as BusinessReviewController, useLanguage, useOrder } from 'ordering-components/native'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import Spinner from 'react-native-loading-spinner-overlay'
import { BusinessBasicInformation } from '../BusinessBasicInformation'
import { View, StyleSheet } from 'react-native'
import { OText } from '../shared'
import { colors } from '../../theme.json'
import {
  BusinessReviewsContainer,
  ScoreView,
  BusinessReviewContent,
  WrapCustomerReview,
  WrapCustomerReviewTotal
} from './styles'
import { ScrollView } from 'react-native-gesture-handler'
import { GrayBackground } from '../BusinessInformation/styles'
import { BusinessReviewsParams } from '../../types'

const Score = ({ star, text }: any) => (
  <ScoreView>
    <View style={styles.reviewScoreStyle}>
      <IconAntDesign
        name="star"
        color={colors.primary}
        size={16}
        style={styles.starIcon}
      />
      <OText>{star}</OText>
    </View>
    <OText>{text}</OText>
  </ScoreView>
)

const BusinessReviewsUI = (props: BusinessReviewsParams) => {
  const {
    businessState,
    reviewsList,
  } = props
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  return (
    <BusinessReviewsContainer>
      <BusinessBasicInformation
        isBusinessInfoShow
        businessState={businessState}
      />
      <BusinessReviewContent>
        {reviewsList.error ? (
          <OText size={16}>{t('ERROR_UNKNOWN', 'An error has ocurred')}</OText>
          ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.wrapTotalScoresStyle}
            >
              <Score star={businessState?.business?.reviews?.quality} text={t('REVIEW_QUALITY', 'Quality of products')} />
              <Score star={businessState?.business?.reviews?.delivery} text={t('REVIEW_PUNCTUALITY', 'Punctuality')} />
              <Score star={businessState?.business?.reviews?.service} text={t('REVIEW_SERVICE', 'Service')} />
              <Score star={businessState?.business?.reviews?.package} text={t('REVIEW_PRODUCT_PACKAGING', 'Product Packaging')} />
            </ScrollView>
            <GrayBackground>
              <OText weight='bold' size={16}>{t('CUSTOMERS_REVIEWS', 'Customers Reviews')}</OText>
            </GrayBackground>
            {reviewsList?.reviews.map((review: any) =>(
              <WrapCustomerReview key={review.id}>
                <WrapCustomerReviewTotal>
                  <View style={styles.reviewScoreStyle}>
                    <IconAntDesign
                      name="star"
                      color={colors.primary}
                      size={16}
                      style={styles.starIcon}
                    />
                    <OText>{review.total}</OText>
                  </View>
                  <OText mLeft={20}>{review.comment}</OText>
                </WrapCustomerReviewTotal>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <Score star={review.quality} text={t('REVIEW_QUALITY', 'Quality of products')} />
                  <Score star={review.delivery} text={t('REVIEW_PUNCTUALITY', 'Punctuality')} />
                  <Score star={review.service} text={t('REVIEW_SERVICE', 'Service')} />
                  <Score star={review.package} text={t('REVIEW_PRODUCT_PACKAGING', 'Product Packaging')} />
                </ScrollView>
              </WrapCustomerReview>
            ))}
          </>
        )}
        {!reviewsList.loading && reviewsList?.reviews.length === 0 && (
          <OText>{t('REVIEWS_NOT_FOUND', 'Reviews Not Found')}</OText>
        )}
      </BusinessReviewContent>
    </BusinessReviewsContainer>
  )
}

const styles = StyleSheet.create({
  starIcon: {
    marginRight: 5,
  },
  reviewScoreStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrapTotalScoresStyle: {
    maxHeight: 80,
    height: 80,
    marginBottom: 20
  }
})

export const BusinessReviews = (props: any) => {
  const BusinessReviewProps = {
    ...props,
    UIComponent: BusinessReviewsUI
  }
  return <BusinessReviewController {...BusinessReviewProps} />
}
