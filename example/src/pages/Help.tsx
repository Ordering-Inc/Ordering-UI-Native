import React from 'react';
import { ScrollView } from 'react-native-gesture-handler'
import { Container } from '../layouts/Container';
import NavBar from '../components/NavBar';
import { useLanguage } from 'ordering-components/native';
import { TouchableOpacity, View } from 'react-native';
import { OText } from '../components/shared';
import { StyleSheet } from 'react-native';
import { colors } from '../theme.json';
import { LastOrder } from '../components/LastOrder';

const Help = ({navigation, route}: any) => {
	
	const [, t] = useLanguage();
	const helpItems = [
		t('HELP_WITH_AN_ORDER', 'Help with an order'), 
		t('ACCOUNT_AND_PAYMENT_OPTIONS', 'Account and Payment Options'), 
		t('GUIDE_TO_ORDERING', 'Guide to Ordering')
	]

	return (
		<Container>
			<NavBar isVertical title={t('HELP', 'Help')} onActionLeft={() => navigation.goBack()} />
			{helpItems && helpItems.map((i, index) => (
				<TouchableOpacity key={`help_id_${index}`} style={helpStyles.item} activeOpacity={0.7}>
					<OText size={12} lineHeight={18} color={colors.textNormal}>{i}</OText>
				</TouchableOpacity>
			))}
			<OText style={{marginTop: 26, marginBottom: 14}} size={14} lineHeight={21} color={colors.textNormal} weight={'500'}>{t('LAST_ORDER', 'Last Order')}</OText>
			<LastOrder />
		</Container>
	)
}

const helpStyles = StyleSheet.create({
	item: {
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
		height: 44,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		marginBottom: 6
	}
})

export default Help;