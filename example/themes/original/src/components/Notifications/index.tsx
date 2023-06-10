import React, { useEffect } from 'react'
import {
	UserFormDetails as NotificationsController,
	useLanguage,
	useSession,
	useOrderingTheme,
	useToast,
	ToastType,
} from 'ordering-components/native'
import { NotificationsGroupSwitchWrapper, SwitchWrapper, Container } from './styles'
import { StyleSheet, View } from 'react-native'
import { useState } from 'react'
import { useTheme } from 'styled-components/native';
import Spinner from 'react-native-loading-spinner-overlay';
import ToggleSwitch from 'toggle-switch-react-native'
import NavBar from '../NavBar'
import { OText } from '../shared'

const NotificationsUI = (props: any) => {
	const {
		navigation,
		singleNotifications,
		handleChangePromotions,
		userData
	} = props

	const theme = useTheme();
	const [{ user: userSession }] = useSession()
	const [, t] = useLanguage();
	const [, { showToast }] = useToast();
	const [orderingTheme] = useOrderingTheme()

	const user = userData || userSession

	const [notificationsList, setNotificationsList] = useState({
		email: singleNotifications?.result?.result
			? !!singleNotifications?.result?.result?.settings?.email?.newsletter
			: !!(singleNotifications?.changes?.settings?.email?.newsletter ?? (user && user?.settings?.email?.newsletter)),
		sms: singleNotifications?.result?.result
			? !!singleNotifications?.result?.result?.settings?.sms?.newsletter
			: !!(singleNotifications?.changes?.settings?.sms?.newsletter ?? (user && user?.settings?.sms?.newsletter)),
		notification: singleNotifications?.result?.result
			? !!singleNotifications?.result?.result?.settings?.notification?.newsletter
			: !!(singleNotifications?.changes?.settings?.notification?.newsletter ?? (user && user?.settings?.notification?.newsletter))
	})

	const goToBack = () => navigation?.canGoBack() && navigation.goBack()
	const showCustomerPromotions = !orderingTheme?.theme?.profile?.components?.promotions?.hidden
	const showNotifications = !orderingTheme?.theme?.profile?.components?.notification_settings?.hidden

	const handleEditNotifications = (key: any, value: any) => {
		setNotificationsList({
			...notificationsList,
			[key]: value
		})
	}

	useEffect(() => {
		if (singleNotifications.result.result && !singleNotifications.loading) {
			if (!singleNotifications.result?.error) {
				showToast(ToastType.Success, t('UPDATE_SUCCESSFULLY', 'Update successfully'));
			}
		}
	}, [singleNotifications.result])

	useEffect(() => {
		const isSingle = true
		handleChangePromotions(notificationsList, isSingle)
	}, [notificationsList])

	return (
		<Container>
			<NavBar
				title={t('NOTIFICATIONS', 'Notifications')}
				titleAlign={'center'}
				onActionLeft={goToBack}
				showCall={false}
				style={{ paddingVertical: 0 }}
				btnStyle={{ paddingLeft: 0 }}
			/>
			{showCustomerPromotions && showNotifications && (
				<>
					<Spinner visible={singleNotifications?.loading} />
					<NotificationsGroupSwitchWrapper>
						<OText style={{ ...styles.title }}>{t('MARKETING_NOTIFICATIONS', 'Marketing Notifications')}</OText>
						<SwitchWrapper>
							<OText>{t('EMAILS', 'Emails')}</OText>
							<ToggleSwitch
								isOn={notificationsList?.email}
								onColor={theme.colors.primary}
								size="small"
								disabled={singleNotifications?.loading}
								offColor={theme.colors.disabled}
								animationSpeed={400}
								onToggle={() => handleEditNotifications('email', !notificationsList?.email)}
							/>
						</SwitchWrapper>
						<SwitchWrapper>
							<OText>{t('SMS', 'Sms')}</OText>
							<ToggleSwitch
								isOn={notificationsList?.sms}
								onColor={theme.colors.primary}
								size="small"
								disabled={singleNotifications?.loading}
								offColor={theme.colors.disabled}
								animationSpeed={400}
								onToggle={() => handleEditNotifications('sms', !notificationsList?.sms)}
							/>
						</SwitchWrapper>
						<SwitchWrapper>
							<OText>{t('PUSH_NOTIFICATIONS', 'Push Notifications')}</OText>
							<ToggleSwitch
								isOn={notificationsList?.notification}
								onColor={theme.colors.primary}
								size="small"
								disabled={singleNotifications?.loading}
								offColor={theme.colors.disabled}
								animationSpeed={400}
								onToggle={() => handleEditNotifications('notification', !notificationsList?.notification)}
							/>
						</SwitchWrapper>
					</NotificationsGroupSwitchWrapper>
				</>
			)}
		</Container>
	)
}

const styles = StyleSheet.create({
	title: {
		marginBottom: 24,
		fontWeight: 'bold',
	}
});

export const NotificationsList = (props: any) => {
	const notificationsListProps = {
		...props,
		UIComponent: NotificationsUI
	}
	return <NotificationsController {...notificationsListProps} />
}
