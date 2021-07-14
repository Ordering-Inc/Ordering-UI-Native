import React, { useState } from 'react'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import IconEvilIcons from 'react-native-vector-icons/EvilIcons'
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { useUtils, useOrder, useLanguage } from 'ordering-components/native'
import { OIcon, OText, OModal } from '../shared'
import { BusinessBasicInformationParams } from '../../types'
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
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
const types = ['food', 'laundry', 'alcohol', 'groceries']

export const BusinessBasicInformation = (props: BusinessBasicInformationParams) => {
  const {
    theme,
    businessState,
    isBusinessInfoShow,
    logo,
    header
  } = props
  const { business, loading } = businessState

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
        style={isBusinessInfoShow
          ? styles.businesInfoheaderStyle
          : { ...styles.headerStyle, backgroundColor: theme.colors.backgroundGray }
        }
        source={{ uri: header || optimizeImage(businessState?.business?.header, 'h_400,c_limit') }}
      >
        <BusinessLogo>
          {loading ? (
            <View style={{ marginLeft: 20 }}>
              <Placeholder Animation={Fade}>
                <PlaceholderLine height={50} width={20} />
              </Placeholder>
            </View>
          ) : (
            !isBusinessInfoShow && (
              <OIcon
                colors={theme.colors}
                url={logo || optimizeImage(businessState?.business?.logo, 'h_300,c_limit')}
                style={styles.businessLogo}
              />
            )
          )}
        </BusinessLogo>
      </BusinessHeader>
      <BusinessInfo
        style={styles.businessInfo}
        colors={theme.colors}
      >
        <View>
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
            {!isBusinessInfoShow && (
              <WrapBusinessInfo
                onPress={() => setOpenBusinessInformation(true)}
              >
                <IconAntDesign
                  name='infocirlceo'
                  color={theme.colors.primary}
                  size={25}
                />
              </WrapBusinessInfo>
            )}
          </BusinessInfoItem>
          {loading ? (
            <Placeholder Animation={Fade}>
              <PlaceholderLine width={10} />
            </Placeholder>
          ) : (
            <View style={{width: '75%'}}>
              <OText color={theme.colors.textSecondary}>{getBusinessType()}</OText>
            </View>
          )}
          <BusinessInfoItem>
            {loading && (
              <Placeholder Animation={Fade}>
                <View style={{ flexDirection: 'row' }}>
                  <PlaceholderLine width={13} style={{ marginRight: 10 }} />
                  <PlaceholderLine width={13} style={{ marginRight: 10 }} />
                  <PlaceholderLine width={13} />
                </View>
              </Placeholder>
            )}
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
            <View style={styles.bullet}>
              <IconEvilIcons
                name='location'
                color={theme.colors.textSecondary}
                size={16}
              />
              <OText color={theme.colors.textSecondary} style={styles.metadata}>{parseDistance(business?.distance || 0)}</OText>
            </View>
            <View style={styles.bullet}>
              <MaterialComIcon
                name='truck-delivery'
                color={theme.colors.textSecondary}
                size={16}
              />
            </View>
            <OText color={theme.colors.textSecondary} style={styles.metadata}>{business && parsePrice(business?.delivery_price || 0)}</OText>
          </BusinessInfoItem>
        </View>
          <WrapReviews>
            <View style={styles.reviewStyle}>
              <IconAntDesign
                name="star"
                color={theme.colors.primary}
                size={16}
                style={styles.starIcon}
              />
              <OText size={20} color={theme.colors.textSecondary}>{business?.reviews?.total}</OText>
            </View>
            {!isBusinessInfoShow && (
              <TouchableOpacity onPress={() => setOpenBusinessReviews(true)}>
                <OText color={theme.colors.primary}>{t('SEE_REVIEWS', 'See reviews')}</OText>
              </TouchableOpacity>
            )}
          </WrapReviews>
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
    top: 0,
    zIndex: 100
  }
})
