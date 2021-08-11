import React from 'react';
import {
	BusinessController as BusinessSingleCard,
	useUtils,
	useOrder,
	useLanguage,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';

import { OIcon, OText } from '../shared';
import { StyleSheet, View } from 'react-native';
import { BusinessControllerParams } from '../../types';
import { convertHoursToMinutes } from '../../utils';
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

export const BusinessControllerUI = (props: BusinessControllerParams) => {
	const {
		business,
		handleClick,
		isBusinessOpen,
		businessWillCloseSoonMinutes,
		isBusinessClose
	} = props;

	const theme = useTheme()

	const styles = StyleSheet.create({
		headerStyle: {
		},
		businessLogo: {
			width: 50,
			height: 50,
			borderRadius: 25,
			justifyContent: 'flex-start',
			alignItems: 'flex-start',
		},
		businessStateView: {
			backgroundColor: '#6C6C6C',
			borderRadius: 10,
		},
		businessStateText: {
			color: theme.colors.white,
			textAlign: 'center',
			padding: 8,
		},
		metadata: {
			marginRight: 20,
			marginLeft: 5,
			marginBottom: -5,
		},
		starIcon: {
			marginTop: 1.5,
			marginHorizontal: 5,
		},
		featured: {
			position: 'absolute',
			padding: 8,
			backgroundColor: theme.colors.backgroundDark,
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
			backgroundColor: theme.colors.backgroundDark,
			opacity: 0.6,
			borderTopRightRadius: 25,
			borderTopLeftRadius: 25,
		},
		bullet: {
			flexDirection: 'row',
			alignItems: 'center'
		}
	});

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
		<Card activeOpacity={1} onPress={() => handleClick(business)}>
			{/* <BusinessHero
        source={{ uri: optimizeImage(business?.header, 'h_400,c_limit') }}
        imageStyle={styles.headerStyle}
        isClosed={isBusinessOpen || isBusinessClose}
      >
        {business?.featured && (
          <View style={styles.featured}>
            <FontAwesomeIcon name='crown' size={26} color='gold' />
          </View>
        )}
        {!isBusinessOpen || isBusinessClose && (
          <View style={styles.closed}>
            <OText size={32} color={theme.colors.white}>{t('CLOSED', 'CLOSED')}</OText>
          </View>
        )}
        {!!businessWillCloseSoonMinutes && orderState.options?.moment === null && isBusinessOpen && (
          <View style={styles.closed}>
            <OText size={32} color={theme.colors.white}>{businessWillCloseSoonMinutes} {t('MINUTES_TO_CLOSE', 'minutes to close')}</OText>
          </View>
        )}
        <BusinessState>
          {!isBusinessOpen && (
            <View style={styles.businessStateView}>
              <OText color={theme.colors.white} size={20} style={styles.businessStateText}>
                {t('PREORDER', 'PREORDER')}
              </OText>
            </View>
          )}
        </BusinessState>
      </BusinessHero> */}

			<BusinessLogo>
				<OIcon
					url={optimizeImage(business?.logo, 'h_300,c_limit')}
					style={styles.businessLogo}
				/>
			</BusinessLogo>
			<BusinessContent>
				<BusinessInfo>
					<OText
						size={14}
						lineHeight={26}
						weight={'400'}
						numberOfLines={1}
						ellipsizeMode='tail'
					>
						{business?.name}
					</OText>
					{/* {business?.reviews?.total > 0 && (
            <Reviews>
              <IconAntDesign
                name="star"
                color={theme.colors.primary}
                size={16}
                style={styles.starIcon}
              />
              <OText>{parseNumber(business?.reviews?.total, { separator: '.' })}</OText>
            </Reviews>
          )} */}
				</BusinessInfo>
				<BusinessCategory>
					<OText style={theme.labels.small} color={theme.colors.textSecondary}>{getBusinessType()}</OText>
				</BusinessCategory>
				<Metadata>
					<View style={styles.bullet}>
						<OText style={theme.labels.small} color={theme.colors.textSecondary}>
							{t('DELIVERY_FEE', 'Delivery fee') + ' '}
							{parsePrice(business?.delivery_price)}
							{` \u2022 `}
							{convertHoursToMinutes(
								orderState?.options?.type === 1
									? business?.delivery_time
									: business?.pickup_time,
							)}
							{` \u2022 `}
							{parseDistance(business?.distance)}
						</OText>
					</View>
				</Metadata>
			</BusinessContent>
		</Card>
	);
};

export const BusinessController = (props: BusinessControllerParams) => {
	const BusinessControllerProps = {
		...props,
		UIComponent: BusinessControllerUI,
	};

	return <BusinessSingleCard {...BusinessControllerProps} />;
};
