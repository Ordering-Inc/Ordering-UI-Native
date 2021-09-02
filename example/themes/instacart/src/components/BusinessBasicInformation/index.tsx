import React, { useState } from 'react'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { useUtils, useOrder, useLanguage, useSession, useConfig } from 'ordering-components/native'
import { useTheme } from 'styled-components/native';

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
	WrapBusinessInfo,
	WrapSearch
} from './styles'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { SearchBar } from '../SearchBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moment from 'moment';
const types = ['food', 'laundry', 'alcohol', 'groceries']

export const BusinessBasicInformation = (props: BusinessBasicInformationParams) => {
	const {
		navigation,
		businessState,
		isBusinessInfoShow,
		logo,
		header,
		handleChangeSearch,
		showReview
	} = props
	const { business, loading } = businessState

	const theme = useTheme()
	const [orderState] = useOrder()
	const [, t] = useLanguage()
	const [{ auth }] = useSession()
	const [{ configs }] = useConfig()
	const [{ parsePrice, parseDistance, optimizeImage, parseDate }] = useUtils()
	const [openBusinessInformation, setOpenBusinessInformation] = useState(false)
	const [openBusinessReviews, setOpenBusinessReviews] = useState(false)
	const [searchVal, setSearchVal] = useState('')
	
	const getBusinessType = () => {
		if (Object.keys(business).length <= 0) return t('GENERAL', 'General')
		const _types: any = []
		types.forEach(type => business[type] && _types.push(
			t(`BUSINESS_TYPE_${type?.replace(/\s/g, '_')?.toUpperCase()}`, type)
		))
		return _types.join(', ')
	}

	const handleSearchCancel = () => {
		setSearchVal('');
		handleChangeSearch('');
		console.log('clicked clear button!');
	}

	const onRedirect = (route: string, params?: any) => {
		navigation.navigate(route, params)
	}


	return (
		<BusinessContainer>
			<BusinessHeader
				style={{...styles.businesInfoheaderStyle}}
				source={{ uri: header || optimizeImage(businessState?.business?.header, 'h_400,c_limit') }}
			>
				<BusinessLogo>
					{loading ? (
						<View>
							<Placeholder Animation={Fade}>
								<PlaceholderLine height={50} width={20} />
							</Placeholder>
						</View>
					) : (
						!isBusinessInfoShow && (
							<OIcon
								url={logo || optimizeImage(businessState?.business?.logo, 'h_300,c_limit')}
								style={styles.businessLogo}
								cover
							/>
						)
					)}
				</BusinessLogo>
				{!isBusinessInfoShow &&
					<TouchableOpacity onPress={() => setOpenBusinessInformation(true)} style={{ alignSelf: 'center', marginBottom: 8 }}>
						<OText style={{ ...theme.labels.normal, textTransform: 'capitalize' }} color={theme.colors.white}>{t('MORE_INFO', 'More Info')}</OText>
					</TouchableOpacity>
				}
				{handleChangeSearch && (
					<WrapSearch>
						<SearchBar
							onSearch={handleChangeSearch}
							onCancel={() => handleSearchCancel()}
							searchValue={searchVal}
							isCancelXButtonShow
							noBorderShow
							placeholder={t('SEARCH_PRODUCTS', 'Search Products')}
							lazyLoad={businessState?.business?.lazy_load_products_recommended}
							inputStyle={{ height: 40, textAlign: 'center' }}
						/>
					</WrapSearch>
				)}
			</BusinessHeader>
			<BusinessInfo
				style={styles.businessInfo}
			>
				<View>
					{loading ? (
						<Placeholder Animation={Fade}>
							<PlaceholderLine width={40} />
						</Placeholder>
					) : (
						<BusinessInfoItem>
							<OText weight={'600'} size={14} lineHeight={21}>{t('DELIVERY_TO', 'Delivery to')}</OText>
						</BusinessInfoItem>
					)}
					<View style={{ height: 1, backgroundColor: theme.colors.border }} />
					<BusinessInfoItem>
						{loading && (
							<Placeholder Animation={Fade}>
								<View style={{ flexDirection: 'row', paddingVertical: 17 }}>
									<PlaceholderLine width={13} style={{ marginRight: 10 }} />
									<PlaceholderLine width={13} style={{ marginRight: 10 }} />
								</View>
							</Placeholder>
						)}
						<View style={{ ...styles.infoItem, paddingEnd: 7, borderRightWidth: 1, borderRightColor: theme.colors.border }}>
							<OText color={theme.colors.textSecondary} numberOfLines={1} style={{ flexBasis: '85%', marginEnd: 6 }}>
								{orderState?.options?.address?.address}
							</OText>
							<TouchableOpacity
								onPress={() => auth
									? onRedirect('AddressList', { isGoBack: true, isFromProductsList: true })
									: onRedirect('AddressForm', { address: orderState.options?.address })}
							>
								<OIcon width={16} src={theme.images.general.pencil} />
							</TouchableOpacity>
						</View>
						<View style={{ ...styles.infoItem, paddingStart: 12 }}>
							<OText color={theme.colors.textSecondary} numberOfLines={1} style={{ flexBasis: '85%', paddingEnd: 6 }}>
								{orderState.options?.moment
									? moment(orderState.options?.moment).format('dddd, MMM.DD.yyyy hh:mm A')
									: t('ASAP_ABBREVIATION', 'ASAP')}
							</OText>
							<TouchableOpacity
								onPress={() => navigation.navigate('MomentOption')}
							>
								<OIcon src={theme.images.general.info} width={16} />
							</TouchableOpacity>
						</View>
						{/* <View style={styles.bullet}>
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
						<OText color={theme.colors.textSecondary} style={styles.metadata}>{business && parsePrice(business?.delivery_price || 0)}</OText> */}
					</BusinessInfoItem>
				</View>
				{showReview && (
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
				)}
			</BusinessInfo>
			<OModal
				titleSectionStyle={styles.modalTitleSectionStyle}
				open={openBusinessInformation}
				onClose={() => setOpenBusinessInformation(false)}
				styleCloseButton={{ color: theme.colors.white, backgroundColor: 'rgba(0,0,0,0.3)' }}
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
				styleCloseButton={{ color: theme.colors.white, backgroundColor: 'rgba(0,0,0,0.3)' }}
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
		height: 260
	},
	headerStyle: {
		height: 260
	},
	businessLogo: {
		width: 103,
		height: 103,
		borderRadius: 100,
		marginBottom: 19,
		overflow: 'hidden',
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
	infoItem: {
		flexBasis: '50%', flexDirection: 'row', alignItems: 'center',
		justifyContent: 'space-between'
	}
})
