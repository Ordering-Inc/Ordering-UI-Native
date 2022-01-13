import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { useUtils, useOrder, useLanguage, useSession, useConfig } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { OIcon, OText, OModal } from '../shared';
import { BusinessBasicInformationParams } from '../../types';
import { convertHoursToMinutes, getTypesText } from '../../utils';
import { BusinessInformation } from '../BusinessInformation';
import { BusinessReviews } from '../BusinessReviews';
import {
	BusinessContainer,
	BusinessHeader,
	BusinessLogo,
	BusinessInfo,
	BusinessInfoItem,
	WrapReviews,
	WrapBusinessInfo,
	AddressInput,
	OrderControlContainer,
	DropOptionButton,
} from './styles';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const types = ['food', 'laundry', 'alcohol', 'groceries'];

export const BusinessBasicInformation = (
	props: BusinessBasicInformationParams,
) => {
	const { navigation, businessState, isBusinessInfoShow, logo, header } = props;
	const { business, loading } = businessState;

	const theme = useTheme();
	const [orderState] = useOrder();
	const [{ auth }] = useSession()
	const [{ configs }] = useConfig();
	const [, t] = useLanguage();
	const [{ parsePrice, parseDistance, optimizeImage, parseDate }] = useUtils();
	const [openBusinessInformation, setOpenBusinessInformation] = useState(false);
	const [openBusinessReviews, setOpenBusinessReviews] = useState(false);
	const { top, bottom } = useSafeAreaInsets()

	const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || [];

	const getBusinessType = () => {
		if (Object.keys(business).length <= 0) return t('GENERAL', 'General');
		const _types: any = [];
		types.forEach(
			(type) =>
				business[type] &&
				_types.push(
					t(`BUSINESS_TYPE_${type?.replace(/\s/g, '_')?.toUpperCase()}`, type),
				),
		);
		return _types.join(', ');
	};

  const onNavigationRedirect = (page: string, params: any) => {
    if (!page) return
    navigation.navigate(page, params);
  }

	return (
		<BusinessContainer>
			<BusinessHeader
				style={
					isBusinessInfoShow
						? {...styles.businesInfoheaderStyle, paddingTop: 0}
						: { ...styles.headerStyle, paddingTop: 0, backgroundColor: theme.colors.backgroundGray }
				}
				source={{
					uri:
						header ||
						optimizeImage(businessState?.business?.header, 'h_400,c_limit'),
				}}>
				{!loading && 	
				<React.Fragment>
					<AddressInput
						onPress={() => auth
							? navigation.navigate('AddressList', { isGoBack: true, isFromProductsList: true })
							: navigation.navigate('AddressForm', { address: orderState.options?.address })}
						style={{marginTop: (!auth || props.isFranchiseApp) ? 36 : top > 0 ? 0 : 20}}
						activeOpacity={0.8}
					>
						<OIcon src={theme.images.general.pin} width={16} color={theme.colors.textSecondary} />
						<OText color={theme.colors.textPrimary} numberOfLines={1} lineHeight={20} weight={Platform.OS === 'android' ? 'bold' : '600'} style={{paddingStart: 10, flexBasis: '90%'}}>
							{orderState?.options?.address?.address}
						</OText>
					</AddressInput>
					<OrderControlContainer>
						<View style={styles.wrapperOrderOptions}>
							<DropOptionButton activeOpacity={0.7} onPress={() => navigation.navigate('OrderTypes', { configTypes: configTypes })}>
								<OText size={12} numberOfLines={1} ellipsizeMode={'tail'} color={theme.colors.textSecondary}>{t(getTypesText(orderState?.options?.type || 1), 'Delivery')}</OText>
								<OIcon
									src={theme.images.general.arrow_down}
									width={10}
									style={{ marginStart: 8 }}
								/>
							</DropOptionButton>
							<DropOptionButton
								onPress={() => navigation.navigate('MomentOption')}>
								<OText
									size={12}
									numberOfLines={1}
									ellipsizeMode="tail"
									color={theme.colors.textSecondary}>
									{orderState.options?.moment
										? parseDate(orderState.options?.moment, {
											outputFormat:
												configs?.format_time?.value === '12'
													? 'MM/DD hh:mma'
													: 'MM/DD HH:mm',
										})
										: t('ASAP_ABBREVIATION', 'ASAP')}
								</OText>
								<OIcon
									src={theme.images.general.arrow_down}
									width={10}
									style={{ marginStart: 8 }}
								/>
							</DropOptionButton>
						</View>
					</OrderControlContainer>
				</React.Fragment>
				}
			</BusinessHeader>
			<BusinessInfo style={styles.businessInfo}>
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
								url={
									logo ||
									optimizeImage(businessState?.business?.logo, 'h_300,c_limit')
								}
								style={styles.businessLogo}
							/>
						)
					)}
				</BusinessLogo>
				<BusinessInfoItem>
					{loading ? (
						<Placeholder Animation={Fade}>
							<PlaceholderLine height={30} width={20} />
						</Placeholder>
					) : (
						<>
							<OText size={24} weight={'600'}>
								{business?.name}
							</OText>
							{!isBusinessInfoShow && (
								<WrapBusinessInfo
                  onPress={() => onNavigationRedirect(
                    'BusinessInformation',
                    { businessState, business }
                  )}
                >
									<OIcon src={theme.images.general.info} width={16} color={theme.colors.textSecondary} />
								</WrapBusinessInfo>
							)}
						</>
					)}
				</BusinessInfoItem>
				{loading ? (
					<Placeholder Animation={Fade}>
						<PlaceholderLine width={10} />
					</Placeholder>
				) : (
					<View style={{ width: '75%' }}>
						<OText color={theme.colors.textNormal}>{getBusinessType()}</OText>
					</View>
				)}
				<View>
					<BusinessInfoItem>
						{loading && (
							<Placeholder Animation={Fade}>
								<View style={{ flexDirection: 'row' }}>
									<PlaceholderLine width={13} style={{ marginRight: 10 }} />
									<PlaceholderLine width={13} style={{ marginRight: 10 }} />
									<PlaceholderLine width={13} style={{ marginRight: 10 }} />
									<PlaceholderLine width={13} />
								</View>
							</Placeholder>
						)}
						<View style={styles.bullet}>
							<OText color={theme.colors.textSecondary} size={12} style={styles.metadata}>
								{`${t('DELIVERY_FEE', 'Delivery fee')} ${business && parsePrice(business?.delivery_price || 0)} \u2022 `}
							</OText>
							{orderState?.options?.type === 1 ? (
								<OText color={theme.colors.textSecondary} size={12} style={styles.metadata}>
									{convertHoursToMinutes(business?.delivery_time) + `  \u2022 `}
								</OText>
							) : (
								<OText color={theme.colors.textSecondary} size={12} style={styles.metadata}>
									{convertHoursToMinutes(business?.pickup_time) + `  \u2022 `}
								</OText>
							)}
							<OText color={theme.colors.textSecondary} size={12} style={styles.metadata}>
								{parseDistance(business?.distance || 0) + `  \u2022 `}
							</OText>
						</View>

						<View style={styles.reviewStyle}>
							<OIcon
								src={theme.images.general.star}
								width={14}
								color={theme.colors.textSecondary}
								style={{ marginTop: -2, marginEnd: 2 }}
							/>
							<OText size={12} color={theme.colors.textSecondary}>
								{business?.reviews?.total}
							</OText>
						</View>
					</BusinessInfoItem>
				</View>
				<WrapReviews>
					{!isBusinessInfoShow && (
						<>
							<TouchableOpacity onPress={() => navigation.navigate('MomentOption')}>
								<OText color={theme.colors.primary} style={{ textDecorationLine: 'underline' }}>
									{t('PRE_ORDER', 'Preorder')}
								</OText>
							</TouchableOpacity>
							<OText size={12} color={theme.colors.textSecondary}>{' \u2022 '}</OText>
							<TouchableOpacity onPress={() => setOpenBusinessReviews(true)}>
								<OText color={theme.colors.primary} style={{ textDecorationLine: 'underline' }}>
									{t('REVIEWS', 'Reviews')}
								</OText>
							</TouchableOpacity>
						</>
					)}
				</WrapReviews>
			</BusinessInfo>
			{/* <OModal
				titleSectionStyle={styles.modalTitleSectionStyle}
				open={openBusinessInformation}
				onClose={() => setOpenBusinessInformation(false)}
				isNotDecoration>
				<BusinessInformation
					businessState={businessState}
					business={business}
				/>
			</OModal> */}
			<OModal
				entireModal
				titleSectionStyle={styles.modalTitleSectionStyle}
				open={openBusinessReviews}
				onClose={() => setOpenBusinessReviews(false)}
				isNotDecoration>
				<BusinessReviews
					businessState={businessState}
					businessId={business.id}
					reviews={business.reviews?.reviews}
				/>
			</OModal>
		</BusinessContainer>
	);
};

const styles = StyleSheet.create({
	businesInfoheaderStyle: {
		height: 150,
		paddingHorizontal: 40
	},
	headerStyle: {
		height: 260,
		paddingHorizontal: 40
	},
	businessLogo: {
		width: 72,
		height: 72,
		borderRadius: 7.6,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	businessInfo: {
		paddingHorizontal: 40,
		paddingTop: 56,
	},
	bullet: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	metadata: {
		marginRight: 2,
	},
	starIcon: {
		marginHorizontal: 5,
	},
	reviewStyle: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	modalTitleSectionStyle: {
		position: 'absolute',
		width: '100%',
		top: 0,
		zIndex: 100,
		left: 40
	},
	wrapperOrderOptions: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		marginBottom: 10,
		zIndex: 100,
	},
});
