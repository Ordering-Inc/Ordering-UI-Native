import React,{ useEffect, useState } from 'react';
import { SafeAreaContainer } from '../../layouts/SafeAreaContainer';
import NavBar from '../NavBar';
import { useLanguage, useUtils } from 'ordering-components/native';
import { ItemInfo, ItemWrap, NoticScroll, PageWrapper } from './styles';
import { OIcon, OText } from '../shared';
import { useTheme } from 'styled-components/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { _retrieveStoreData } from '../../providers/StoreUtil';

const Notifications = (props: any) => {
	const { navigation } = props;
	const [, t] = useLanguage()
	const theme = useTheme()
	const [{ optimizeImage }] = useUtils();
	const [businessLogo, setLogo] = useState(null);

	const items = [
		{
			id: 'notic_id_01',
			content: '20% In all our dishes only from Monday to Friday',
			date: '2021.09.18 12:45 PM'
		},
		{
			id: 'notic_id_02',
			content: '20% In all our dishes only from Monday to Friday',
			date: '2021.09.18 09:45 AM'
		},
		{
			id: 'notic_id_03',
			content: '20% In all our dishes only from Monday to Friday',
			date: '2021.09.16 02:15 AM'
		},
		{
			id: 'notic_id_04',
			content: '20% In all our dishes only from Monday to Friday',
			date: '2021.09.15 11:24 AM'
		},
		{
			id: 'notic_id_05',
			content: '20% In all our dishes only from Monday to Friday',
			date: '2021.09.14 06:55 AM'
		},
		{
			id: 'notic_id_06',
			content: '20% In all our dishes only from Monday to Friday',
			date: '2021.09.15 11:24 AM'
		},
		{
			id: 'notic_id_07',
			content: '20% In all our dishes only from Monday to Friday',
			date: '2021.09.14 06:55 AM'
		},
		{
			id: 'notic_id_08',
			content: '20% In all our dishes only from Monday to Friday',
			date: '2021.09.15 11:24 AM'
		},
		{
			id: 'notic_id_09',
			content: '20% In all our dishes only from Monday to Friday',
			date: '2021.09.14 06:55 AM'
		},
		{
			id: 'notic_id_10',
			content: '20% In all our dishes only from Monday to Friday',
			date: '2021.09.15 11:24 AM'
		},
		{
			id: 'notic_id_11',
			content: '20% In all our dishes only from Monday to Friday',
			date: '2021.09.14 06:55 AM'
		},
	]

	const callLogo = async () => {
		const { businessLogo } = await _retrieveStoreData('b_logo');
		setLogo(businessLogo)
	}	

	useEffect(() => {
		callLogo();
	}, [])

	const renderItem = ({id, content, date}: any) => (
		<ItemWrap>
			<OIcon url={optimizeImage(businessLogo, 'h_300,c_limit')} width={63} height={63} />
			<ItemInfo>
				<OText size={12} lineHeight={18}>{content}</OText>
				<OText size={12} lineHeight={18} color={theme.colors.textSecondary}>{date}</OText>
			</ItemInfo>
			<TouchableOpacity style={{top: -5, paddingEnd: 4}}>
				<OIcon src={theme.images.general.close} width={10} />
			</TouchableOpacity>
		</ItemWrap>
	)

	return (
		<SafeAreaContainer>
			<PageWrapper>
				<NavBar
					onActionLeft={() => navigation.goBack()}
					btnStyle={{ paddingStart: 0 }}
					title={t('NOTIFICATIONS', 'Notifications')}
					isVertical
				/>
				<NoticScroll showsVerticalScrollIndicator={false}>
					{items.map((item: any) => 
						<React.Fragment key={item.id}>
							{renderItem(item)}
						</React.Fragment>
					)}
				</NoticScroll>
			</PageWrapper>
		</SafeAreaContainer>
	)
};

export default Notifications;

