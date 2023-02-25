import React, { useEffect, useState } from 'react';
import {
	UserFormDetails as UserProfileController,
	useSession,
	useLanguage,
	ToastType,
	useToast,
	useConfig
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { useForm } from 'react-hook-form';
import Spinner from 'react-native-loading-spinner-overlay';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ProfileParams } from '../../types';
import { LogoutButton } from '../LogoutButton'
import { LanguageSelector } from '../LanguageSelector'
import MessageCircle from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FastImage from 'react-native-fast-image'
import { OAlert } from '../../../../../src/components/shared'

import {
	OIcon,
	OText,
} from '../shared';
import {
	CenterView,
	Actions,
	ListWrap,
	ListItem,
	NotificationsWrapper,
	NotificationBadge
} from './styles';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components';
import ToggleSwitch from 'toggle-switch-react-native';

const ProfileListUI = (props: ProfileParams) => {
	const {
		navigation,
		notificationsGroup,
		handleRemoveAccount,
		removeAccountState,
		handleChangePromotions,
	} = props;

	const theme = useTheme();

	const isChewLayout = theme?.header?.components?.layout?.type?.toLowerCase() === 'chew'
	const hideProfileImage = theme?.profile?.components?.picture?.hidden
	const hideOrders = theme?.profile?.components?.orders?.hidden
	const hideProfile = theme?.profile?.components?.profile?.hidden
	const hideWallet = theme?.profile?.components?.wallet?.hidden
	const hideMessages = theme?.bar_menu?.components?.messages?.hidden
	const hideHelp = theme?.bar_menu?.components?.help?.hidden
	const hideFavorites = theme?.bar_menu?.components?.favortes?.hidden
	const hideSession = theme?.bar_menu?.components?.sessions?.hidden
	const hidePromotions = theme?.bar_menu?.components?.promotions?.hidden
	const hideAddressList = theme?.profile?.components?.address_list?.hidden
	const showLanguages = theme?.profile?.components?.languages?.hidden
	const showNotifications = !theme?.profile?.components?.notification_settings?.hidden
	const langPickerStyle = StyleSheet.create({
		inputAndroid: {
			color: theme.colors.textNormal,
			fontSize: 14,
			fontWeight: '500',
			paddingEnd: 24,
			paddingStart: 0,
			height: 40,
			borderWidth: 1,
			borderColor: theme.colors.clear,
			backgroundColor: theme.colors.clear
		},
		inputIOS: {
			color: theme.colors.textNormal,
			fontSize: 14,
			fontWeight: '500',
			paddingEnd: 24,
			height: 40,
			borderWidth: 1,
			borderColor: theme.colors.clear,
			backgroundColor: theme.colors.clear
		},
		icon: {
			width: 12,
			marginTop: 7,
			marginEnd: 7
		}
	})

	const styles = StyleSheet.create({
		photo: {
			borderRadius: 7.6,
			shadowColor: '#000000',
			shadowOffset: { width: 0, height: 1 },
			shadowRadius: 2,
			shadowOpacity: 0.2,
			backgroundColor: theme.colors.white,
			marginEnd: 14
		},
		pagePadding: {
			paddingHorizontal: isChewLayout ? 20 : 40
		},
		messageIconStyle: {
			fontSize: 18,
			fontWeight: 'bold',
			marginEnd: 14
		}
	});


	const [{ user }, { logout }] = useSession();
	const [, t] = useLanguage();
	const [{ configs }] = useConfig();
	const [, { showToast }] = useToast();
	const { errors } = useForm();

	const isAdmin = user?.level === 0

	const { height } = useWindowDimensions();
	const { top, bottom } = useSafeAreaInsets();

	const [confirm, setConfirm] = useState<any>({ open: false, content: null, handleOnAccept: null, id: null, title: null })
	const isWalletEnabled = configs?.cash_wallet?.value && configs?.wallet_enabled?.value === '1' && (configs?.wallet_cash_enabled?.value === '1' || configs?.wallet_credit_point_enabled?.value === '1')
	const IsPromotionsEnabled = configs?.advanced_offers_module?.value === '1' || configs?.advanced_offers_module?.value === true
	const onRedirect = (route: string, params?: any) => {
		navigation.navigate(route, params)
	}

	useEffect(() => {
		if (notificationsGroup.result.result && !notificationsGroup.loading) {
			if (!notificationsGroup.result?.error) {
				showToast(ToastType.Success, t('UPDATE_SUCCESSFULLY', 'Update successfully'));
			}
		}
	}, [notificationsGroup.result])

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			// Convert all errors in one string to show in toast provider
			const list = Object.values(errors);
			let stringError = '';
			list.map((item: any, i: number) => {
				stringError +=
					i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
			});
			showToast(ToastType.Error, stringError);
		}
	}, [errors]);

	const detailProps = {
		goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
		onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params)
	}

	const onRemoveAccount = () => {
		setConfirm({
			open: true,
			content: [t('QUESTION_REMOVE_ACCOUNT', 'Are you sure that you want to remove your account?')],
			title: t('ACCOUNT_ALERT', 'Account alert'),
			handleOnAccept: () => {
				setConfirm({ ...confirm, open: false })
				handleRemoveAccount && handleRemoveAccount(user?.id)
			}
		})
	}

	useEffect(() => {
		if (removeAccountState?.result === 'OK') {
			logout()
		}
	}, [removeAccountState])

	return (
		<View style={{ flex: 1, height: height - top - bottom, paddingTop: 20 }}>
			<CenterView style={styles.pagePadding}>
				{user?.photo && !hideProfileImage && (
					<View style={styles.photo}>
						<FastImage
							style={{ height: 60, width: 60, borderRadius: 8 }}
							source={{
								uri: user?.photo,
								priority: FastImage.priority.normal,
							}}
							resizeMode={FastImage.resizeMode.cover}
						/>
					</View>
				)}
				<View style={{ flexBasis: '70%' }}>
					<OText size={20} lineHeight={30} weight={Platform.OS === 'ios' ? '500' : 'bold'} color={theme.colors.textNormal}>{user?.name} {user?.lastname}</OText>
					{!hideProfile && (
						<TouchableOpacity onPress={() => navigation.navigate('ProfileForm', { ...detailProps })}>
							<OText size={12} lineHeight={18} color={theme.colors.primary} style={{ textDecorationLine: 'underline' }}>{t('VIEW_ACCOUNT', 'View account')}</OText>
						</TouchableOpacity>
					)}
				</View>
			</CenterView>
			<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginVertical: 32 }} />
			<Spinner visible={notificationsGroup?.loading} />
			<ListWrap style={{ ...styles.pagePadding }}>
				<Actions>
					{!hideAddressList && (
						<ListItem onPress={() => onRedirect('AddressList', { isFromProfile: true, isGoBack: true })} activeOpacity={0.7}>
							<OIcon src={theme.images.general.pin} width={16} color={theme.colors.textNormal} style={{ marginEnd: 14 }} />
							<OText size={14} lineHeight={24} weight={'400'} color={theme.colors.textNormal}>{t('SAVED_PLACES', 'My saved places')}</OText>
						</ListItem>
					)}
					{!hideMessages && (
						<ListItem onPress={() => onRedirect('Messages', { isFromProfile: true, isGoBack: true })} activeOpacity={0.7}>
							<MessageCircle name='message1' style={styles.messageIconStyle} color={theme.colors.textNormal} />
							<OText size={14} lineHeight={24} weight={'400'} color={theme.colors.textNormal}>{t('MESSAGES', 'Messages')}</OText>
						</ListItem>
					)}
					{!hideOrders && (
						<ListItem onPress={() => onRedirect('MyOrders', { isFromProfile: true, isGoBack: true })} activeOpacity={0.7}>
							<FontAwesome name='list-alt' style={styles.messageIconStyle} color={theme.colors.textNormal} />
							<OText size={14} lineHeight={24} weight={'400'} color={theme.colors.textNormal}>{t('MY_ORDERS', 'My Orders')}</OText>
						</ListItem>
					)}
					{isWalletEnabled && !hideWallet && (
						<ListItem onPress={() => onRedirect('Wallets', { isFromProfile: true, isGoBack: true })} activeOpacity={0.7}>
							<Ionicons name='wallet-outline' style={styles.messageIconStyle} color={theme.colors.textNormal} />
							<OText size={14} lineHeight={24} weight={'400'} color={theme.colors.textNormal}>{t('WALLETS', 'Wallets')}</OText>
						</ListItem>
					)}
					{IsPromotionsEnabled && !hidePromotions && (
						<ListItem onPress={() => onRedirect('Promotions', { isFromProfile: true, isGoBack: true })} activeOpacity={0.7}>
							<MaterialIcons name='local-offer' style={styles.messageIconStyle} color={theme.colors.textNormal} />
							<OText size={14} lineHeight={24} weight={'400'} color={theme.colors.textNormal}>{t('PROMOTIONS', 'Promotions')}</OText>
						</ListItem>
					)}
					{!hideHelp && (
						<ListItem onPress={() => navigation.navigate('Help', {})} activeOpacity={0.7}>
							<OIcon src={theme.images.general.ic_help} width={16} color={theme.colors.textNormal} style={{ marginEnd: 14 }} />
							<OText size={14} lineHeight={24} weight={'400'} color={theme.colors.textNormal}>{t('HELP', 'Help')}</OText>
						</ListItem>
					)}
					{!showNotifications && (
						<ListItem onPress={() => navigation.navigate('Notifications', { isFromProfile: true, isGoBack: true })} activeOpacity={0.7}>
							<NotificationBadge style={{ borderRadius: 100 / 2 }} />
							<Ionicons name='notifications-outline' style={styles.messageIconStyle} color={theme.colors.textNormal} />
							<OText size={14} lineHeight={24} weight={'400'} color={theme.colors.textNormal}>{t('MARKETING_NOTIFICATIONS', 'Marketing notifications')}
							</OText>
							<NotificationsWrapper>
								<ToggleSwitch
									isOn={user && (!!user?.settings?.notification?.newsletter ||
										!!user?.settings?.sms?.newsletter ||
										!!user?.settings?.email?.newsletter)}
									onColor={theme.colors.primary}
									size="small"
									disabled={notificationsGroup?.loading}
									offColor={theme.colors.disabled}
									animationSpeed={400}
									onToggle={() => handleChangePromotions(!(user && (!!user?.settings?.notification?.newsletter ||
										!!user?.settings?.sms?.newsletter ||
										!!user?.settings?.email?.newsletter)))}
								/>
							</NotificationsWrapper>
						</ListItem>
					)}
					{!hideSession && (
						<ListItem onPress={() => navigation.navigate('Sessions')} activeOpacity={0.7}>
							<Ionicons name='md-list-outline' style={styles.messageIconStyle} color={theme.colors.textNormal} />
							<OText size={14} lineHeight={24} weight={'400'} color={theme.colors.textNormal}>{t('SESSIONS', 'Sessions')}</OText>
						</ListItem>
					)}
					{!hideFavorites && (
						<ListItem onPress={() => navigation.navigate('Favorite')} activeOpacity={0.7}>
							<Ionicons name='heart-outline' style={styles.messageIconStyle} color={theme.colors.textNormal} />
							<OText size={14} lineHeight={24} weight={'400'} color={theme.colors.textNormal}>{t('FAVORITES', 'Favorites')}</OText>
						</ListItem>
					)}
				</Actions>

				<Actions>
					{!showLanguages && (
						<LanguageSelector iconColor={theme.colors.textNormal} pickerStyle={langPickerStyle} />
					)}
					<View style={{ height: 17 }} />
					<LogoutButton color={theme.colors.textNormal} text={t('LOGOUT', 'Logout')} />
					<View style={{ height: 17 }} />
					<ListItem disabled={isAdmin} onPress={() => onRemoveAccount()} activeOpacity={0.7}>
						<OIcon src={theme.images.general.user} width={16} color={theme.colors.textNormal} style={{ marginEnd: 14 }} />
						<OText size={14} lineHeight={24} weight={'400'} style={{ opacity: isAdmin ? 0.5 : 1 }} color={theme.colors.danger5}>{t('REMOVE_ACCOUNT', 'Remove account')}</OText>
					</ListItem>
				</Actions>
			</ListWrap>
			<OAlert
				open={confirm.open}
				title={confirm.title}
				content={confirm.content}
				onAccept={confirm.handleOnAccept}
				onCancel={() => setConfirm({ ...confirm, open: false, title: null })}
				onClose={() => setConfirm({ ...confirm, open: false, title: null })}
			/>
		</View>
	);
};

export const UserProfile = (props: any) => {
	const profileProps = {
		...props,
		UIComponent: ProfileListUI,
	};
	return <UserProfileController {...profileProps} />;
};
