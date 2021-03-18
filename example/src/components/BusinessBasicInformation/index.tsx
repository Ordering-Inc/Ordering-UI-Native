import React, { useState } from 'react'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import IconEvilIcons from 'react-native-vector-icons/EvilIcons'
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { useUtils, useOrder, useLanguage } from 'ordering-components/native'
import { OIcon, OText, OModal } from '../shared'
import { BusinessBasicInformationParams } from '../../types'
import { colors } from '../../theme'
import { convertHoursToMinutes } from '../../utils'
import { BusinessInformation } from '../BusinessInformation'
import { BusinessReviews } from '../BusinessReviews'
import {
  BusinessContainer,
  BusinessHeader,
  BusinessLogo,
  BusinessInfo,
  BusinessInfoItem,
  WrapReviews,
  WrapBusinessInfo
} from './styles'
const types = ['food', 'laundry', 'alcohol', 'groceries']

export const BusinessBasicInformation = (props: BusinessBasicInformationParams) => {
  const {
    businessState,
    isBusinessInfoShow
  } = props
  const { business } = businessState

  const [orderState] = useOrder()
  const [, t] = useLanguage()
  const [{ parsePrice, parseDistance, optimizeImage }] = useUtils()
  const [openBusinessInformation, setOpenBusinessInformation] =  useState(false)
  const [openBusinessReviews, setOpenBusinessReviews] = useState(false)
  const getBusinessType = () => {
    if (Object.keys(business).length <= 0) return 'none'
    const typeObj = types.map(t => {
      return { [t]: business[t] }
    }).reduce((r, c) => ({ ...r, ...c }), {})
    const businessType = Object.entries(typeObj).reduce((a, [k, v]) => v !== false ? [...a, [k, v]] : a, [])[0]
    return businessType[0]
  }
  return (
    <BusinessContainer>
      <BusinessHeader
        style={isBusinessInfoShow ? styles.businesInfoheaderStyle : styles.headerStyle}
        source={{ uri: business?.header }}
      >
        <BusinessLogo>
          {!isBusinessInfoShow && (
            <OIcon url={optimizeImage(business?.logo, 'h_200,c_limit')} style={styles.businessLogo} />
          )}
        </BusinessLogo>
      </BusinessHeader>
      <BusinessInfo style={styles.businessInfo}>
        <View>
          <BusinessInfoItem>
            <OText size={20} weight='bold'>
              {business?.name}
            </OText>
            {!isBusinessInfoShow && (
              <WrapBusinessInfo
                onPress={() => setOpenBusinessInformation(true)}
              >
                <IconAntDesign
                  name='infocirlceo'
                  color={colors.primary}
                  size={16}
                />
              </WrapBusinessInfo>
            )}
          </BusinessInfoItem>
          <View>
            <OText color={colors.textSecondary}>{getBusinessType()}</OText>
          </View>
          <BusinessInfoItem>
            <View style={styles.bullet}>
              <IconEvilIcons
                name='clock'
                color={colors.textSecondary}
                size={16}
              />
              {orderState?.options?.type === 1 ? (
                <OText color={colors.textSecondary} style={styles.metadata}>
                  {convertHoursToMinutes(business?.delivery_time)}
                </OText>
              ) : (
                <OText color={colors.textSecondary} style={styles.metadata}>
                  {convertHoursToMinutes(business?.pickup_time)}
                </OText>
              )}
            </View>
            <View style={styles.bullet}>
              <IconEvilIcons
                name='location'
                color={colors.textSecondary}
                size={16}
              />
              <OText color={colors.textSecondary} style={styles.metadata}>{parseDistance(business?.distance || 0)}</OText>
            </View>
            <View style={styles.bullet}>
              <MaterialComIcon
                name='truck-delivery'
                color={colors.textSecondary}
                size={16}
              />
            </View>
            <OText color={colors.textSecondary} style={styles.metadata}>{business && parsePrice(business?.delivery_price || 0)}</OText>
          </BusinessInfoItem>
        </View>
        <WrapReviews>
          <View style={styles.reviewStyle}>
            <IconAntDesign
              name="star"
              color={colors.primary}
              size={16}
              style={styles.starIcon}
            />
            <OText size={20} color={colors.textSecondary}>{business?.reviews?.total}</OText>
          </View>
          {!isBusinessInfoShow && (
            <TouchableOpacity onPress={() => setOpenBusinessReviews(true)}>
              <OText color={colors.primary}>{t('SEE_REVIEWS', 'See reviews')}</OText>
            </TouchableOpacity>
          )}
        </WrapReviews>
      </BusinessInfo>
      <OModal
       titleSectionStyle={styles.modalTitleSectionStyle}
       open={openBusinessInformation}
       onClose={() => setOpenBusinessInformation(false)}
      >
        <BusinessInformation
          businessState={businessState}
          business={business}
        />
      </OModal>
      <OModal
       titleSectionStyle={styles.modalTitleSectionStyle}
       open={openBusinessReviews}
       onClose={() => setOpenBusinessReviews(false)}
      >
        <BusinessReviews
          businessState={businessState}
          businessId={business.id}
          reviews={business.reviews?.reviews}
        />
      </OModal>
    </BusinessContainer>
  )
}

const styles = StyleSheet.create({
  businesInfoheaderStyle: {
    height: 150
  },
  headerStyle: {
    height: 260
  },
  businessLogo: {
    width: 75,
    height: 75,
    borderRadius: 20,
    marginLeft: 20,
    marginBottom: 40,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  businessInfo: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    transform: [{ translateY: -20 }],
  },
  bullet: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  metadata: {
    marginRight: 20,
    marginLeft: 5,
  },
  starIcon: {
    marginHorizontal: 5,
  },
  reviewStyle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalTitleSectionStyle: {
    position: 'absolute',
    width: '100%',
    top: 0    
  }
})
