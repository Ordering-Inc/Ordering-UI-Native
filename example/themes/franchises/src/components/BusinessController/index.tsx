import React from 'react';
import {
	BusinessController as BusinessSingleCard,
	useUtils,
	useOrder,
	useLanguage,
} from 'ordering-components/native';
import { OButton, OIcon, OText } from '../shared';
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
	BusinessInfoInner,
	LikeBtn,
	PreOrderBtn,
} from './styles';
import { useTheme } from 'styled-components/native';

export const BusinessControllerUI = (props: BusinessControllerParams) => {
	const { business, handleClick } = props;
	const [{ parsePrice, parseDistance, parseNumber, optimizeImage }] =
		useUtils();
	const [orderState] = useOrder();
	const [, t] = useLanguage();
	const theme = useTheme()

	const styles = StyleSheet.create({
		headerStyle: {
			borderTopLeftRadius: 7.6,
			borderTopRightRadius: 7.6,
		},
		businessLogo: {
			backgroundColor: 'white',
			width: 62,
			height: 62,
			borderRadius: 7.6,
			justifyContent: 'center',
			alignItems: 'center',
			marginTop: -32,
			shadowColor: '#000000',
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.1,
			shadowRadius: 1
		},
		businessStateView: {
			backgroundColor: '#DEE2E6',
			borderRadius: 50,
			height: 20,
			alignItems: 'center',
			justifyContent: 'center',
			paddingHorizontal: 8,
		},
		businessStateText: {
			textAlign: 'center',
		},

		starIcon: {
			marginHorizontal: 2,
			marginTop: -2,
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
			alignItems: 'center',
			justifyContent: 'flex-start',
		},
		startBtn: {
			height: 26,
			borderRadius: 7.6,
			backgroundColor: theme.colors.clear,
			borderWidth: 1,
			shadowOpacity: 0,
			paddingLeft: 0,
			paddingRight: 0,
			borderColor: theme.colors.primary,
			marginTop: 4
		}
	});

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

	const getOrderTypes = () => {
		return `Eat In | Drive Thru | Delivery | Curbside | Pickup`;
	}

	return (
		<Card activeOpacity={1} onPress={() => handleClick(business)}>
			<BusinessContent>
				<BusinessInfo>
					<BusinessInfoInner>
						<OText size={12} lineHeight={18} weight={'bold'} mBottom={5}>
							{business?.name}
						</OText>
						<OText size={10} lineHeight={15} color={theme.colors.textThird} mBottom={4}>
							{business?.address}
						</OText>
						<BusinessCategory>
							<OText size={8} lineHeight={12} color={theme.colors.textSecondary}>{getOrderTypes()}</OText>
						</BusinessCategory>
					</BusinessInfoInner>
					<View style={{alignItems: 'flex-end'}}>
						{business?.reviews?.total >= 0 && (
							<Reviews>
								<OIcon src={theme.images.general.star} width={12} style={styles.starIcon} color={theme.colors.textSecondary} />
								<OText size={12} style={{ lineHeight: 15 }}>
									{parseNumber(business?.reviews?.total, { separator: '.' })}
								</OText>
								<LikeBtn>
									<OIcon src={theme.images.general.heart} width={14} />
								</LikeBtn>
							</Reviews>
						)}
						<OButton 
							onClick={() => handleClick(business)} 
							text={t('START_ORDER', 'Start order')} 
							style={styles.startBtn} 
							textStyle={{fontSize: 12, color: theme.colors.primary}} 
						/>
					</View>
				</BusinessInfo>
				
				<Metadata>
						<PreOrderBtn onPress={() => handleClick(business)}>
							<OText
								color={theme.colors.primary}
								size={10} lineHeight={15}>
								{t('PRE_ORDER', 'Preorder')}
							</OText>
						</PreOrderBtn>
					{!business?.open ? (
						<View style={styles.closed}>
							<OText size={10} color={theme.colors.red}>
								{t('CLOSED', 'Closed')}
							</OText>
						</View>
					) : (
						<View style={styles.bullet}>
							
						</View>
					)}
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
