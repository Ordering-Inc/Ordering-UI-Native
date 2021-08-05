import React, { useState } from 'react'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import IconEvilIcons from 'react-native-vector-icons/EvilIcons'
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { useUtils, useOrder, useLanguage } from 'ordering-components/native'
import { OIcon, OText, OModal } from '../../../../../components/shared'
import { BusinessBasicInformationParams } from '../../../../../types'

import { useTheme } from 'styled-components/native'
import { convertHoursToMinutes } from '../../../../../utils'
import { BusinessInformation } from '../../../../../components/BusinessInformation'
import { BusinessReviews } from '../../../../../components/BusinessReviews'
import {
  BusinessContainer,
  BusinessHeader,
  BusinessLogo,
  BusinessInfo,
  BusinessInfoItem,
  WrapReviews,
  VerticalLine
} from './styles'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
const types = ['food', 'laundry', 'alcohol', 'groceries']

export const BusinessBasicInformation = (props: BusinessBasicInformationParams) => {
  const {
    businessState,
    isBusinessInfoShow,
    logo,
    header
  } = props
  const { business, loading } = businessState

  const theme = useTheme()
  const [orderState] = useOrder()
  const [, t] = useLanguage()
  const [{ parsePrice, parseDistance, optimizeImage }] = useUtils()
  const [openBusinessInformation, setOpenBusinessInformation] = useState(false)
  const [openBusinessReviews, setOpenBusinessReviews] = useState(false)
  const getBusinessType = () => {
    if (Object.keys(business).length <= 0) return t('GENERAL', 'General')
    const _types: any = []
    types.forEach(type => business[type] && _types.push(
      t(`BUSINESS_TYPE_${type?.replace(/\s/g, '_')?.toUpperCase()}`, type)
    ))
    return _types.join(', ')
  }

  return (
    <BusinessContainer>
      <BusinessHeader
        style={isBusinessInfoShow ? styles.businesInfoheaderStyle : { ...styles.headerStyle, backgroundColor: theme.colors.backgroundGray }}
        source={{ uri: header || optimizeImage(businessState?.business?.header, 'h_400,c_limit') }}
      >
        <BusinessLogo>
          {loading ? (
            <View style={{ marginLeft: 20 }}>
              <Placeholder Animation={Fade}>
                <PlaceholderLine height={50} width={15} style={{ borderRadius: 5 }} />
              </Placeholder>
            </View>
          ) : (
            !isBusinessInfoShow && (
              <OIcon url={logo || optimizeImage(businessState?.business?.logo, 'h_300,c_limit')} style={styles.businessLogo} />
            )
          )}
        </BusinessLogo>
      </BusinessHeader>
      <BusinessInfo>
        <BusinessInfoItem>
          {loading ? (
            <Placeholder Animation={Fade}>
              <PlaceholderLine height={30} width={20} />
            </Placeholder>
          ) : (
            <View style={{ maxWidth: '75%', justifyContent: 'flex-start' }}>
              <OText
                size={20}
                weight='bold'
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {business?.name}
              </OText>
            </View>
          )}
        </BusinessInfoItem>
        <WrapReviews>
          <View style={styles.reviewStyle}>
            <IconAntDesign
              name='star'
              color={theme.colors.primary}
              size={16}
            />
            <OText size={14} weight={500} style={{ paddingHorizontal: 10 }} color={theme.colors.black}>{business?.reviews?.total}</OText>
            <OText size={14}>({business?.reviews?.reviews.length} {t('REVIEWS', 'Reviews')})</OText>
          </View>
          {!isBusinessInfoShow && (
            <TouchableOpacity onPress={() => setOpenBusinessReviews(true)}>
              <OText color={theme.colors.green} mLeft={10}>{t('SEE_REVIEWS', 'See reviews')}</OText>
            </TouchableOpacity>
          )}
        </WrapReviews>
        {loading ? (
          <Placeholder Animation={Fade}>
            <PlaceholderLine width={10} />
          </Placeholder>
        ) : (
          <View style={{ width: '75%' }}>
            <OText color={theme.colors.textSecondary} style={{ textAlign: 'left' }}>{getBusinessType()}</OText>
          </View>
        )}
        <BusinessInfoItem>
          {loading ? (
            <Placeholder Animation={Fade}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <PlaceholderLine width={13} style={{ marginRight: 10 }} />
                <PlaceholderLine width={13} style={{ marginRight: 10 }} />
                <PlaceholderLine width={13} />
              </View>
            </Placeholder>
          ) : (
            <>
              <View style={styles.bullet}>
                <IconEvilIcons
                  name='clock'
                  color={theme.colors.textSecondary}
                  size={16}
                />
                {orderState?.options?.type === 1 ? (
                  <OText color={theme.colors.textSecondary} style={styles.metadata}>
                    {convertHoursToMinutes(business?.delivery_time)}
                  </OText>
                ) : (
                  <OText color={theme.colors.textSecondary} style={styles.metadata}>
                    {convertHoursToMinutes(business?.pickup_time)}
                  </OText>
                )}
              </View>
              <VerticalLine />
              <View style={styles.bullet}>
                <IconEvilIcons
                  name='location'
                  color={theme.colors.textSecondary}
                  size={16}
                />
                <OText color={theme.colors.textSecondary} style={styles.metadata}>{parseDistance(business?.distance || 0)}</OText>
              </View>
              <VerticalLine />
              <View style={styles.bullet}>
                <MaterialComIcon
                  name='truck-delivery'
                  color={theme.colors.textSecondary}
                  size={16}
                />
                <OText color={theme.colors.textSecondary} style={styles.metadata}>{business && parsePrice(business?.delivery_price || 0)}</OText>
              </View>
            </>
          )}
        </BusinessInfoItem>
      </BusinessInfo>
      <OModal
        titleSectionStyle={styles.modalTitleSectionStyle}
        open={openBusinessInformation}
        onClose={() => setOpenBusinessInformation(false)}
        styleCloseButton={{color: theme.colors.white, backgroundColor: 'rgba(0,0,0,0.3)'}}
        isNotDecoration
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
        styleCloseButton={{color: theme.colors.white, backgroundColor: 'rgba(0,0,0,0.3)'}}
        isNotDecoration
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
    height: 210
  },
  businessLogo: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginLeft: 20,
    marginBottom: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  bullet: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  metadata: {
    marginRight: 20,
    marginLeft: 5,
  },
  reviewStyle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalTitleSectionStyle: {
    position: 'absolute',
    width: '100%',
    top: 0,
    zIndex: 100
  }
})
