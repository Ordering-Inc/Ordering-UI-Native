import React from 'react';
import { useLanguage, useOrder } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { StyleSheet, View } from 'react-native';
import { OButton, OIcon, OText } from '../shared';
import { LanguageSelector } from '../LanguageSelector';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useWindowDimensions } from 'react-native';

export const Home = (props: any) => {
	const { onNavigationRedirect } = props;
	const { width } = useWindowDimensions();
	const [, t] = useLanguage();
	const [orderState] = useOrder();

	const theme = useTheme();

	return (
		<View style={styles.container}>
			<View>
				<LanguageSelector />
				<OIcon
					src={theme.images.logos.logotypeInvert}
					style={{
						...styles.logo,
						resizeMode: 'contain',
						width: width - 80,
						height: (width - 80) * 0.25,
					}}
				/>
			</View>
			<View style={styles.wrapperBtn}>
				<OText color={theme.colors.white} size={40}>
					{t('WELCOME', 'Welcome!')}
				</OText>
				<OText color={theme.colors.white} size={14} style={{ marginBottom: 46 }}>
					{t('LETS_START_ORDER', "Let's start to order now")}
				</OText>
				<OButton
					text={t('LOGIN_NOW', 'Login now')}
					bgColor={theme.colors.primary}
					borderColor={theme.colors.primary}
					style={styles.buttons}
					isCircle={false}
					textStyle={{ color: 'white' }}
					onClick={() => onNavigationRedirect('Login')}
					imgRightSrc={null}
				/>
				<OButton
					text={t('SIGNUP', 'Signup')}
					bgColor={theme.colors.primaryContrast}
					borderColor={theme.colors.primaryContrast}
					style={styles.buttons}
					onClick={() => onNavigationRedirect('Signup')}
					imgRightSrc={null}
				/>
				<TouchableOpacity
					style={{ ...styles.textLink, marginTop: 12 }}
					onPress={() =>
						orderState?.options?.address?.address
							? onNavigationRedirect('BusinessList', { isGuestUser: true })
							: onNavigationRedirect('AddressForm', { isGuestUser: true })
					}>
					<OText weight="normal" size={18} color={theme.colors.white}>
						{t('CONTINUE_AS_GUEST', 'Continue as guest')}
					</OText>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	textLink: {
		flexDirection: 'row',
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 40,
	},
	logo: {
		marginTop: 64,
	},
	buttons: {
		marginVertical: 6,
		borderRadius: 7.6,
	},
	sloganText: {
		textAlign: 'center',
	},
	wrapperBtn: {
		width: '100%',
		position: 'absolute',
		bottom: 0,
		marginBottom: 20,
	},
});
