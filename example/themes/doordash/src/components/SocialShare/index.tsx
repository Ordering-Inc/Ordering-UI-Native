import React, { useState } from 'react';
import { ImageSourcePropType, ImageStyle, Platform, StyleSheet } from 'react-native';
import Share from 'react-native-share';
import { OIcon } from '../shared';
import { FavItem, FavMenu } from './styles';
import { useTheme } from 'styled-components/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface SSFTypes {
	icon?: ImageSourcePropType,
	mode?: 'dropdown' | 'sheets',
	data?: {url?: string, image?: string},
	style?: ImageStyle
}

const SAppName = {
	FACEBOOK: 'facebook',
	WHATSAPP: 'whatsapp',
	INSTAGRAM: 'instagram',
	GOOGLEPLUS: 'googleplus',
	EMAIL: 'email',
	TELEGRAM: 'telegram',
	LINKEDIN: 'linkedin',
};

const SocialShareFav = (props: SSFTypes) => {
	const { icon, style, mode, data } = props;

	const theme = useTheme();

	const SApps: Array<any> = [
		{
			name: SAppName.FACEBOOK,
			social: Share.Social.FACEBOOK,
			icon: theme.images.social.facebook,
			color: '#1877F2'
		},
		{
			name: SAppName.WHATSAPP,
			social: Share.Social.WHATSAPP,
			icon: theme.images.social.whatsapp,
			color: '#25D366'
		},
		{
			name: SAppName.INSTAGRAM,
			social: Share.Social.INSTAGRAM,
			icon: theme.images.social.instagram,
			color: '#E4405F'
		},
		{
			name: SAppName.GOOGLEPLUS,
			social: Share.Social.GOOGLEPLUS,
			icon: theme.images.social.googleplus,
			color: '#DB4A39'
		},
		{
			name: SAppName.EMAIL,
			social: Share.Social.EMAIL,
			icon: theme.images.social.email,
			color: '#34465D'
		},
		{
			name: SAppName.TELEGRAM,
			social: Share.Social.TELEGRAM,
			icon: theme.images.social.telegram,
			color: '#0088cc'
		},
		{
			name: SAppName.LINKEDIN,
			social: Share.Social.LINKEDIN,
			icon: theme.images.social.linkedin,
			color: '#0A66C2'
		},
	];

	const [showMenu, setShowMenu] = useState(false);

	const onShare = async (social: any) => {
		const options = {
			title: 'Share via',
			message: 'some message',
			url: 'some share url',
			social: social,
			whatsAppNumber: "9199999999",  // country code + phone number
			// filename: 'test' , // only for base64 file in Android
		}
		setShowMenu(false);
		const shareResult = await Share.shareSingle(options);
	}

	const onOpenMenu = () => {
		setShowMenu(!showMenu);
	}

	return (
		<>
		<FavItem onPress={onOpenMenu}>
			<OIcon src={icon} style={style} />
		</FavItem>
		{showMenu && 
			<FavMenu>
				{SApps.map(({name, social, icon, color}) => 
					<React.Fragment key={name}>
					{name === SAppName.LINKEDIN ? Platform.OS === 'android' ? 
					 	<TouchableOpacity key={name} style={favStyles.itemBtn} onPress={() => onShare(social)}>
							<OIcon src={icon} color={color} />
						</TouchableOpacity>
					 : null :
					 	<TouchableOpacity key={name} style={favStyles.itemBtn} onPress={() => onShare(social)}>
							<OIcon src={icon} color={color} />
						</TouchableOpacity>
					 }
					</React.Fragment>
				)}
			</FavMenu>
		}
		</>
	)
}

const favStyles = StyleSheet.create({
	itemBtn: {
		borderRadius: 7.6,
		marginBottom: 4,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white'
	}
});

export default SocialShareFav;
