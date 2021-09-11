import React, { useState, useEffect } from 'react';
import { ImageSourcePropType, ImageStyle, Platform, StyleSheet } from 'react-native';
import Share from 'react-native-share';
import { OIcon } from '../shared';
import { FavItem, FavMenu } from './styles';
import { useTheme } from 'styled-components/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ToastType, useToast } from 'ordering-components/native';

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
	const [, { showToast }] = useToast();

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
	const [result, setResult] = useState<{success: boolean, message: string}>({success: false, message: 'default'});

	const getErrorString = (error: any, defaultValue?: any) => {
    let e = defaultValue || 'Something went wrong. Please try again';
    if (typeof error === 'string') {
      e = error;
    } else if (error && error.message) {
      e = error.message;
    } else if (error && error.props) {
      e = error.props;
    }
    return e;
  }

	const onShare = async (social: any) => {
		const options = {
			title: 'Share via',
			message: 'Awesome Restaurant!, Please enjoy your meal ;)',
			url: 'https://www.ordering.co',
			social: social,
			whatsAppNumber: "8615640383320",  // country code + phone number
			// filename: 'test' , // only for base64 file in Android
		}
		setShowMenu(false);
		try {
      const shareResult = await Share.shareSingle(options);
      setResult({success: shareResult.success, message: shareResult.message});
    } catch (error) {
      setResult({success: false, message: 'error: '.concat(getErrorString(error, `Wrong ${social} configuration!`))});
    }
	}

	const onOpenMenu = () => {
		setShowMenu(!showMenu);
	}

	useEffect(() => {
		if (result.success) {
			showToast(ToastType.Success, result.message);
		} else {
			showToast(ToastType.Error, result.message);
		}
	}, [result])

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
