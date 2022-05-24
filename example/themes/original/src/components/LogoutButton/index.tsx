import React from 'react';
import { TouchableOpacity } from 'react-native';
import { LogoutAction } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { OIcon, OText } from '../shared';
import { _retrieveStoreData } from '../../providers/StoreUtil';

const LogoutButtonUI = (props: any) => {
	const { handleLogoutClick, text, color, iconSize } = props
	const theme = useTheme();

	const handleClick = async () => {
		const data = await _retrieveStoreData('notification_state');
		handleLogoutClick(data)
	  };
	
	return (
		<TouchableOpacity
			onPress={() => handleClick()}
			style={{ flexDirection: 'row', alignItems: 'center' }}
		>
			<OIcon
				src={theme.images.general.logout}
				width={iconSize ?? 17}
				color={color ? color : theme.colors.textNormal}
				style={{ marginEnd: 14 }}
			/>
			{text ? <OText weight={'500'} color={color ? color : theme.colors.textNormal}>{text}</OText> : null}
		</TouchableOpacity>
	)
}

export const LogoutButton = (props: any) => {
	const logoutProps = {
		...props,
		isNative: true,
		UIComponent: LogoutButtonUI
	}
	return (
		<LogoutAction {...logoutProps} />
	)
}
