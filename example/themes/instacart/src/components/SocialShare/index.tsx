import React, { useState } from 'react';
import { ImageSourcePropType, Platform } from 'react-native';
import Share from 'react-native-share';
import { OIcon, OIconButton, OText } from '../shared';
import { FavItem, FavMenu, FavMenuItem } from './styles';
import { useTheme } from 'styled-components/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface SSFTypes {
	icon?: ImageSourcePropType,
	mode?: 'dropdown' | 'sheets',
	data?: {url?: string, image?: string, msg?: string},
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
	const { icon, mode, data } = props;

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
			title: 'Share Ordering App',
			message: data?.msg ? `${data.msg}` : ``,
			url: data?.url ? `${data?.url}` : `https://ordering.co`,
			social: social,
			whatsAppNumber: "9199999999",  // country code + phone number
			// filename: 'test' , // only for base64 file in Android
		}
		const shareResult = await Share.shareSingle(options);
	}

	const onOpenMenu = () => {
		setShowMenu(!showMenu);
	}

	return (
		<>
		<FavItem onPress={onOpenMenu}>
			<OIcon src={icon} width={17} />
		</FavItem>
		{showMenu && 
			<FavMenu>
				{SApps.map(({name, social, icon, color}) => 
					<React.Fragment key={name}>
					{name === SAppName.LINKEDIN ? Platform.OS === 'android' ? 
					 	<FavMenuItem>
							<TouchableOpacity key={name} onPress={() => onShare(social)}>
								<OIcon src={icon} color={color} />
							</TouchableOpacity>
						 </FavMenuItem>
					 : null :
					 <FavMenuItem>
					 	<TouchableOpacity key={name} onPress={() => onShare(social)}>
							<OIcon src={icon} color={color} />
						</TouchableOpacity>
					 </FavMenuItem>
					 }
					</React.Fragment>
				)}
			</FavMenu>
		}
		</>
	)
}

export default SocialShareFav;
