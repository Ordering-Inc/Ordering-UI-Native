import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, TextStyle } from 'react-native'
import { useUtils, useOrder, useLanguage } from 'ordering-components/native'
import { OIcon, OText, OModal } from '../shared'
import { BusinessBasicInformationParams } from '../../types'
import { convertHoursToMinutes } from '../../utils'
import { BusinessInformation } from '../BusinessInformation'
import { BusinessReviews } from '../BusinessReviews'
import { useTheme } from 'styled-components/native'
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
		businessState,
		isBusinessInfoShow,
		logo,
		header,
		noImage
	} = props
	const { business, loading } = businessState

	const theme = useTheme();

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
			paddingHorizontal: 40,
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
		},
		deliveryInfo: {
			flexDirection: 'row',
			minHeight: 55, borderRadius: 7.6, borderWidth: 1, borderColor: theme.colors.border,
			marginVertical: 11,
			justifyContent: 'space-around',
			alignItems: 'center',
		},
		dInfoItem: {
			alignItems: 'center'
		}
	})

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
			{!noImage && (
				<BusinessHeader
					style={isBusinessInfoShow ? styles.businesInfoheaderStyle : { ...styles.headerStyle, backgroundColor: theme.colors.backgroundGray }}
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
								<OIcon url={logo || optimizeImage(businessState?.business?.logo, 'h_300,c_limit')} style={styles.businessLogo} />
							)
						)}
					</BusinessLogo>
				</BusinessHeader>
			)}
			<BusinessInfo style={styles.businessInfo}>
				<View style={{ width: '100%' }}>
					<BusinessInfoItem>
						{loading ? (
							<Placeholder Animation={Fade}>
								<PlaceholderLine height={30} width={20} />
							</Placeholder>
						) : (
							<View style={{ justifyContent: 'flex-start' }}>
								<OText
									size={24}
									weight='600'
									numberOfLines={1}
									ellipsizeMode='tail'
									style={{ lineHeight: 36 }}
								>
									{business?.name}
								</OText>
							</View>
						)}
					</BusinessInfoItem>
					{loading ? (
						<Placeholder Animation={Fade}>
							<PlaceholderLine width={10} />
						</Placeholder>
					) : (
						<View>
							<OText color={theme.colors.textSecondary}>{getBusinessType()}</OText>
						</View>
					)}
					<BusinessInfoItem style={{ flexDirection: 'row' }}>
						{loading ? (
							<Placeholder Animation={Fade}>
								<View style={{ flexDirection: 'row' }}>
									<PlaceholderLine width={12} style={{ marginRight: 10 }} />
									<PlaceholderLine width={12} style={{ marginRight: 10 }} />
									<PlaceholderLine width={12} />
								</View>
							</Placeholder>
						) : (
							<View style={styles.reviewStyle}>
								<OText style={theme.labels.small as TextStyle} color={theme.colors.textSecondary}>{business?.reviews?.total}</OText>
								<OIcon src={theme.images.general.star} width={10} style={{marginHorizontal: 2}} />
								<TouchableOpacity onPress={() => setOpenBusinessReviews(true)}>
									<OText style={{ fontSize: 10, textDecorationLine: 'underline' } as TextStyle} color={theme.colors.primary}>
										{business?.reviews?.reviews?.length + ' ' + t('REVIEWS', 'reviews')}
									</OText>
								</TouchableOpacity>
								<OText color={theme.colors.textSecondary} style={theme.labels.small as TextStyle}>{' \u2022 ' + parseDistance(business?.distance || 0)}</OText>
							</View>
						)}
					</BusinessInfoItem>
					<View style={styles.deliveryInfo}>
						<View style={styles.dInfoItem}>
							<OText style={theme.labels.middle as TextStyle}>{business && parsePrice(business?.delivery_price || 0)}</OText>
							<OText style={theme.labels.normal as TextStyle} color={theme.colors.textSecondary}>{t('DELIVERY_FEE', 'Delivery fee').toLowerCase()}</OText>
						</View>
						<View style={{ width: 1, backgroundColor: theme.colors.border, height: 26 }} />
						<View style={styles.dInfoItem}>
							<OText style={theme.labels.middle as TextStyle}>
								{orderState?.options?.type === 1 ?
									convertHoursToMinutes(business?.delivery_time) :
									convertHoursToMinutes(business?.pickup_time)
								}
							</OText>
							<OText style={theme.labels.normal as TextStyle} color={theme.colors.textSecondary}>{t('DELIVERY_TIME', 'Delivery time').toLowerCase()}</OText>
						</View>
					</View>
				</View>
			</BusinessInfo>
			<OModal
				titleSectionStyle={styles.modalTitleSectionStyle}
				open={openBusinessInformation}
				onClose={() => setOpenBusinessInformation(false)}
				styleCloseButton={{ color: theme.colors.white, backgroundColor: 'rgba(0,0,0,0.3)' }}
				isNotDecoration
				overScreen
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
				styleCloseButton={{ color: theme.colors.white, backgroundColor: 'rgba(0,0,0,0.3)' }}
				isNotDecoration
				overScreen
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
