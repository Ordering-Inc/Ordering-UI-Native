import React from 'react';
import {
	BusinessController as BusinessSingleCard,
	useUtils,
	useOrder,
	useLanguage,
} from 'ordering-components/native';
import { OIcon, OText } from '../../../../components/shared';
import { StyleSheet, TextStyle, View } from 'react-native';
import { colors, labels } from '../../theme.json';
import { BusinessControllerParams } from '../../../../types';
import { convertHoursToMinutes } from '../../../../utils';
import {
	Card,
	BusinessHero,
	BusinessContent,
	BusinessCategory,
	BusinessInfo,
	Metadata,
	BusinessState,
	BusinessLogo,
	Reviews,
} from './styles';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export const BusinessControllerUI = (props: BusinessControllerParams) => {
	const { business, handleClick, isBusinessOpen, businessWillCloseSoonMinutes, isBusinessClose, isHorizontal } = props;
	const [{ parsePrice, parseDistance, parseNumber, optimizeImage }] = useUtils();
	const [orderState] = useOrder();
	const [, t] = useLanguage();

	const types = ['food', 'laundry', 'alcohol', 'groceries'];

	const getBusinessType = () => {
		if (Object.keys(business).length <= 0) return t('GENERAL', 'General');
		const _types: any = [];
		types.forEach((type) => {
			if (business[type]) {
				_types.push(t(type.toUpperCase(), type));
			}
		});
		return _types.join(', ');
	};

	return (
		<Card activeOpacity={1} onPress={() => handleClick(business)} style={{ width: isHorizontal ? 188 : '100%', marginEnd: isHorizontal ? 27 : 0, overflow: 'hidden' }}>
			<BusinessHero
				source={{ uri: optimizeImage(business?.header, 'h_400,c_limit') }}
				imageStyle={styles.headerStyle}
				isClosed={isBusinessOpen || isBusinessClose}
				style={{ height: isHorizontal ? 117 : 128 }}
			>
				{/* {business?.featured && (
					<View style={styles.featured}>
						<FontAwesomeIcon name='crown' size={26} color='gold' />
					</View>
				)} */}
				{!isBusinessOpen || isBusinessClose && (
					<View style={styles.closed}>
						<OText size={20} color={colors.white}>{t('CLOSED', 'CLOSED')}</OText>
					</View>
				)}
				{!!businessWillCloseSoonMinutes && orderState.options?.moment === null && isBusinessOpen && (
					<View style={styles.closed}>
						<OText size={32} color={colors.white}>{businessWillCloseSoonMinutes} {t('MINUTES_TO_CLOSE', 'minutes to close')}</OText>
					</View>
				)}
				{/* <BusinessLogo>
          <OIcon url={optimizeImage(business?.logo, 'h_300,c_limit')} style={styles.businessLogo} />
        </BusinessLogo> */}
				<BusinessState>
					{!isBusinessOpen && (
						<View style={styles.businessStateView}>
							<OText color={colors.textSecondary} size={12} style={styles.businessStateText}>
								{t('PREORDER', 'PREORDER')}
							</OText>
						</View>
					)}
				</BusinessState>
			</BusinessHero>
			<BusinessContent>
				<BusinessInfo>
					<View style={{ width: '70%', alignItems: 'flex-start' }}>
						<OText
							numberOfLines={1}
							ellipsizeMode='tail'
							style={labels.middle as TextStyle}
						>
							{business?.name}
						</OText>
					</View>
					{/* {business?.reviews?.total > 0 && (
            <Reviews>
              <IconAntDesign
                name="star"
                color={colors.primary}
                size={16}
                style={styles.starIcon}
              />
              <OText>{parseNumber(business?.reviews?.total, { separator: '.' })}</OText>
            </Reviews>
          )} */}
				</BusinessInfo>
				<BusinessCategory>
					<OText color={colors.textSecondary} size={12} style={{ lineHeight: 18, fontWeight: '400' }}>{getBusinessType()}</OText>
				</BusinessCategory>
				<Metadata>
					<View style={styles.bullet}>
						<OText color={colors.textSecondary} style={labels.small as TextStyle}>{t('DELIVERY_TIME', 'Delivery time') + ' \u2022 '}</OText>
						<OText style={styles.metadata}>
							{convertHoursToMinutes(
								orderState?.options?.type === 1
									? business?.delivery_time
									: business?.pickup_time,
							)}
						</OText>
					</View>
					{!isHorizontal && (
						<>
							<View style={styles.bullet}>
								<OText color={colors.textSecondary} style={labels.small as TextStyle}>{t('SERVICE_FEE', 'Service fee') + ' \u2022 '}</OText>
								<OText style={styles.metadata}>
									{parsePrice(business?.delivery_price)}
								</OText>
							</View>
							<View style={styles.bullet}>
								<OText color={colors.textSecondary} style={labels.small as TextStyle}>{t('DISTANCE', 'Distance') + ' \u2022 '}</OText>
								<OText style={styles.metadata}>
									{parseDistance(business?.distance)}
								</OText>
							</View>
						</>
					)}
				</Metadata>
			</BusinessContent>
		</Card>
	);
};

const styles = StyleSheet.create({
	headerStyle: {
		borderRadius: 7.6,
	},
	businessLogo: {
		width: 75,
		height: 75,
		marginLeft: 20,
		marginBottom: 20,
		borderRadius: 25,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	businessStateView: {
		backgroundColor: colors.backgroundGray300,
		borderRadius: 7.6,
	},
	businessStateText: {
		textAlign: 'center',
		paddingHorizontal: 7,
		paddingVertical: 4,
	},
	metadata: {
		fontWeight: '400',
		fontSize: 10,
		color: colors.textSecondary
	},
	starIcon: {
		marginTop: 1.5,
		marginHorizontal: 5,
	},
	featured: {
		position: 'absolute',
		padding: 8,
		backgroundColor: colors.backgroundDark,
		opacity: 0.8,
		borderRadius: 10,
		left: 20,
		top: 10
	},
	closed: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.backgroundDark,
		opacity: 0.6,
		borderRadius: 7.6,
	},
	bullet: {
		flexDirection: 'row',
		alignItems: 'center'
	}
});

export const BusinessController = (props: BusinessControllerParams) => {
	const BusinessControllerProps = {
		...props,
		UIComponent: BusinessControllerUI,
	};

	return <BusinessSingleCard {...BusinessControllerProps} />;
};
