import React from 'react';
import { Modal, View } from 'react-native';
import { useLanguage, LogoutAction } from 'ordering-components/native';

import NavBar from '../NavBar';
import { OSBody, OSContainer, OSContent } from './styles';
import { OButton, OInput, OText } from '../shared';
import { useDeviceOrientation } from '../../hooks/device_orientation_hook';
import { useTheme } from 'styled-components/native';

const LogoutPopupUI = (props: Props) => {
	const {
    open,
		onClose,
		handleLogoutClick,
		onLogoutDone,
	} = props;

	const theme = useTheme();
	const [, t] = useLanguage();
	const [orientationState] = useDeviceOrientation();

  return (
		<Modal
			animationType='fade'
			transparent={true}
			visible={open}
			onRequestClose={onClose}
			style={{
				width: 200,
				minHeight: 300,
			}}
		>
			<OSContainer>
				<OSContent>
					<NavBar
						title={t('SIGN_OUT', 'Sign out')}
						titleStyle={{ paddingLeft: 10 }}
						style={{ backgroundColor: 'transparent', paddingBottom: 1, }}
						rightComponent={<OButton
							text={t('CANCEL', 'Cancel')}
							bgColor="transparent"
							borderColor="transparent"
							style={{ paddingEnd: 20 }}
							textStyle={{ color: theme.colors.primary, marginEnd: 0 }}
							onClick={onClose}
						/>}
					/>

					<OSBody>
						<OText
							size={orientationState?.dimensions?.width * 0.032}
							mBottom={20}
						>
							{t('ONLY_MANAGER_LOGOUT', 'Only the manager has the password to sign out this App.')}
						</OText>
						
						<View
							style={{ minHeight: 120 }}
						>
							<OInput
								isSecured
								placeholder={t('PASSWORD', 'Password')}
								onChange={(e: any) => {}}
								style={{
									borderColor: theme.colors.secundaryContrast,
									borderRadius: 6,
									flex: 1,
									minHeight: 40,
									marginBottom: 20,
								}}
							/>

							<OButton
								text={t('SIGN_OUT', 'Sign out')}
								onClick={() => {
									handleLogoutClick();
									onClose();
									onLogoutDone && onLogoutDone();
								}}
							/>
						</View>

					</OSBody>

				</OSContent>
			</OSContainer>
		</Modal>
	);
}

interface Props {
  open: boolean;
	formState: { loading: boolean, result: { error: boolean, result: any } },
	handleLogoutClick: () => void;
	onClose: () => void;
	onLogoutDone?: () => void;
}

export const LogoutPopup = (props: any) => {
  const logoutProps = {
    ...props,
    isNative: true,
    UIComponent: LogoutPopupUI
  }
  return (
    <LogoutAction {...logoutProps} />
  )
}

