import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useUtils, useOrder, useLanguage } from 'ordering-components/native';
import { OIcon, OText, OModal } from '../../../../components/shared';
import { BusinessBasicInformationParams } from '../../../../types';
import { colors, images } from '../../theme.json';
import { convertHoursToMinutes } from '../../../../utils';
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
} from './styles';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
const types = ['food', 'laundry', 'alcohol', 'groceries'];

export const BusinessBasicInformation = (
	props: BusinessBasicInformationParams,
) => {
	const { navigation, businessState, isBusinessInfoShow, logo, header } = props;
	const { business, loading } = businessState;

	const [orderState] = useOrder();
	const [, t] = useLanguage();
	const [{ parsePrice, parseDistance, optimizeImage }] = useUtils();
	const [openBusinessInformation, setOpenBusinessInformation] = useState(false);
	const [openBusinessReviews, setOpenBusinessReviews] = useState(false);
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

	return (
		<BusinessContainer>
			<BusinessHeader
				style={
					isBusinessInfoShow
						? styles.businesInfoheaderStyle
						: { ...styles.headerStyle, backgroundColor: colors.backgroundGray }
				}
				source={{
					uri:
						header ||
						optimizeImage(businessState?.business?.header, 'h_400,c_limit'),
				}}>
				{!isBusinessInfoShow && (
					<WrapBusinessInfo onPress={() => setOpenBusinessInformation(true)}>
						<OIcon src={images.general.info} width={24} />
					</WrapBusinessInfo>
				)}
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
						<OText size={24} weight={'600'}>
							{business?.name}
						</OText>
					)}
				</BusinessInfoItem>
				{loading ? (
					<Placeholder Animation={Fade}>
						<PlaceholderLine width={10} />
					</Placeholder>
				) : (
					<View style={{ width: '75%' }}>
						<OText color={colors.textNormal}>{getBusinessType()}</OText>
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
							<OText color={colors.textSecondary} size={12} style={styles.metadata}>
								{`${t('DELIVERY_FEE', 'Delivery fee')} ${business && parsePrice(business?.delivery_price || 0)} \u2022 `}
							</OText>
							{orderState?.options?.type === 1 ? (
								<OText color={colors.textSecondary} size={12} style={styles.metadata}>
									{convertHoursToMinutes(business?.delivery_time) + `  \u2022 `}
								</OText>
							) : (
								<OText color={colors.textSecondary} size={12} style={styles.metadata}>
									{convertHoursToMinutes(business?.pickup_time) + `  \u2022 `}
								</OText>
							)}
							<OText color={colors.textSecondary} size={12} style={styles.metadata}>
								{parseDistance(business?.distance || 0) + `  \u2022 `}
							</OText>
						</View>

						<View style={styles.reviewStyle}>
							<OIcon
								src={images.general.star}
								width={14}
								color={colors.textSecondary}
								style={{ marginTop: -2, marginEnd: 2 }}
							/>
							<OText size={12} color={colors.textSecondary}>
								{business?.reviews?.total}
							</OText>
						</View>
					</BusinessInfoItem>
				</View>
				<WrapReviews>
					{!isBusinessInfoShow && (
						<>
							<TouchableOpacity onPress={() => navigation.navigate('MomentOption')}>
								<OText color={colors.primary} style={{ textDecorationLine: 'underline' }}>
									{t('PRE_ORDER', 'Preorder')}
								</OText>
							</TouchableOpacity>
							<OText size={12} color={colors.textSecondary}>{' \u2022 '}</OText>
							<TouchableOpacity onPress={() => setOpenBusinessReviews(true)}>
								<OText color={colors.primary} style={{ textDecorationLine: 'underline' }}>
									{t('REVIEWS', 'Reviews')}
								</OText>
							</TouchableOpacity>
						</>
					)}
				</WrapReviews>
			</BusinessInfo>
			<OModal
				titleSectionStyle={styles.modalTitleSectionStyle}
				open={openBusinessInformation}
				onClose={() => setOpenBusinessInformation(false)}
				isNotDecoration>
				<BusinessInformation
					businessState={businessState}
					business={business}
				/>
			</OModal>
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
	},
	headerStyle: {
		height: 260,
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
});
