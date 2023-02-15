import React from 'react';
import {
	BusinessController as BusinessSingleCard,
	useUtils,
	useOrder,
	useLanguage,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { OIcon, OText } from '../shared';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { BusinessControllerParams } from '../../types';
import { convertHoursToMinutes, lightenDarkenColor, shape } from '../../utils';
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
	RibbonBox
} from './styles';

export const BusinessFeaturedCtrlUI = (props: BusinessControllerParams) => {
	const { business, handleClick, isBusinessOpen } = props;
	const [{ parsePrice, parseDistance, parseNumber, optimizeImage }] =
		useUtils();
	const [orderState] = useOrder();
	const [, t] = useLanguage();

	const theme = useTheme();


	const styles = StyleSheet.create({
		headerStyle: {
			borderTopLeftRadius: 25,
			borderTopRightRadius: 25,
		},
		businessLogo: {
			alignSelf: 'center',
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
		},
		metaField: {
			paddingEnd: 3,
			marginEnd: 2,
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
			top: 10,
		},
		closed: {

		},
		bullet: {
			flexDirection: 'row',
			justifyContent: 'flex-start',
			width: '100%',
		},
	});

	const types = ['food', 'laundry', 'alcohol', 'groceries'];

	const { width } = useWindowDimensions();

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
			{business?.ribbon?.enabled && (
				<RibbonBox
					bgColor={business?.ribbon?.color}
					colorText={lightenDarkenColor(business?.ribbon?.color)}
					borderRibbon={lightenDarkenColor(business?.ribbon?.color)}
					isRoundRect={business?.ribbon?.shape === shape?.rectangleRound}
					isCapsule={business?.ribbon?.shape === shape?.capsuleShape}
				>
					<OText
						size={10}
						weight={'400'}
						color={lightenDarkenColor(business?.ribbon?.color) ? theme.colors.black : theme.colors.white}
						numberOfLines={2}
						ellipsizeMode='tail'
						lineHeight={13}
					>
						{business?.ribbon?.text}
					</OText>
				</RibbonBox>
			)}
			<BusinessHero>
				<BusinessLogo>
					<OIcon
						url={optimizeImage(business?.logo, 'h_100,c_limit')}
						width={40}
						height={40}
					/>
				</BusinessLogo>
				<BusinessContent style={{ width: width * 0.6 }}>
					<BusinessInfo>
						<OText size={12} ellipsizeMode={'tail'} numberOfLines={2}>
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
                <OText>
                  {parseNumber(business?.reviews?.total, { separator: '.' })}
                </OText>
              </Reviews>
            )} */}
					</BusinessInfo>
					{/* <BusinessCategory>
            <OText>{getBusinessType()}</OText>
          </BusinessCategory> */}
					<Metadata>
						{!isBusinessOpen ? (
							<View style={styles.closed}>
								<OText size={10} color={theme.colors.red}>
									{t('CLOSED', 'Closed')}
								</OText>
							</View>
						) : (
							<View style={styles.bullet}>
								{/* <MaterialComIcon name="alarm" size={16} /> */}
								<OText size={10} color={theme.colors.textSecondary}>
									{t('DELIVERY_FEE', 'Delivery Fee')}
								</OText>
								<OText
									size={10}
									color={theme.colors.textSecondary}
									style={styles.metaField}>
									{parsePrice(business?.delivery_price) + '  \u2022'}
								</OText>

								<OText
									size={10}
									color={theme.colors.textSecondary}
									style={styles.metaField}>
									{convertHoursToMinutes(
										orderState?.options?.type === 1
											? business?.delivery_time
											: business?.pickup_time,
									) + '  \u2022'}
								</OText>

								<OText size={10} color={theme.colors.textSecondary}>
									{parseDistance(business?.distance)}
								</OText>
							</View>
						)}
					</Metadata>
				</BusinessContent>
				{/* <BusinessState>
          {!business?.open && (
            <View style={styles.businessStateView}>
              <OText color={theme.colors.white} size={20} style={styles.businessStateText}>
                {t('PREORDER', 'PREORDER')}
              </OText>
            </View>
          )}
        </BusinessState> */}
			</BusinessHero>
		</Card>
	);
};

export const BusinessFeaturedController = (props: BusinessControllerParams) => {
	const BusinessControllerProps = {
		...props,
		UIComponent: BusinessFeaturedCtrlUI,
	};

	return <BusinessSingleCard {...BusinessControllerProps} />;
};
