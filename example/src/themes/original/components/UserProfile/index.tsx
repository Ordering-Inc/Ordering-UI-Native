import React, { useEffect } from 'react';
import {
  UserFormDetails as UserProfileController,
  useSession,
  useLanguage,
} from 'ordering-components/native';
import { useForm } from 'react-hook-form';
import Spinner from 'react-native-loading-spinner-overlay';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors,images } from '../../theme.json';
import { ToastType, useToast } from '../../../../providers/ToastProvider';
import { ProfileParams } from '../../../../types';
import { LogoutButton } from '../LogoutButton'
import { LanguageSelector } from '../LanguageSelector'

import {
  OIcon,
  OText,
} from '../../../../components/shared';
import {
  CenterView,
  Actions,
  ListWrap,
  ListItem
} from './styles';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProfileListUI = (props: ProfileParams) => {
  const {
    navigation,
    formState
  } = props;

  const [{ user }] = useSession();
  const [, t] = useLanguage();
  const { showToast } = useToast();
  const { errors } = useForm();

  const { height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();

  	const onRedirect = (route: string, params?: any) => {
		navigation.navigate(route, params)
	}

  useEffect(() => {
    if (formState.result.result && !formState.loading) {
      if (formState.result?.error) {
        showToast(ToastType.Error, formState.result.result);
      } else {
        showToast(ToastType.Success, t('UPDATE_SUCCESSFULLY', 'Update successfully'));
      }
    }
  }, [formState.result])

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

  return (
    <View style={{ flex: 1, height: height - top - bottom - 62}}>
	 	<OText size={24} color={colors.textNormal} lineHeight={36} weight={Platform.OS === 'ios' ? '600' : 'bold'} style={{marginTop: 14, marginBottom: 24, ...styles.pagePadding}}>{t('PROFILE', 'Profile')}</OText>
      <CenterView style={styles.pagePadding}>
			<View style={styles.photo}>
				<OIcon
					url={user?.photo}
					src={!user?.photo && images.general.user}
					width={60}
					height={60}
				/>
			</View>
		  <View style={{flexBasis: '70%'}}>
			  <OText size={20} lineHeight={30} weight={Platform.OS === 'ios' ? '500' : 'bold'} color={colors.textNormal}>{`${user?.name} ${user?.lastname}`}</OText>
			  <TouchableOpacity onPress={() => navigation.navigate('ProfileForm', {...detailProps})}>
				  <OText size={12} lineHeight={18} color={colors.primary} style={{textDecorationLine: 'underline'}}>{t('VIEW_ACCOUNT', 'View account')}</OText>
			  </TouchableOpacity>
		  </View>
      </CenterView>
		<View style={{height: 8, backgroundColor: colors.backgroundGray100, marginVertical: 32}} />
      <Spinner visible={formState?.loading} />
      <ListWrap style={{...styles.pagePadding}}>
			<Actions>
				<ListItem onPress={() => onRedirect('AddressList', { isFromProfile: true, isGoBack: true })} activeOpacity={0.7}>
					<OIcon src={images.general.pin} width={16} color={colors.textNormal} style={{marginEnd: 14}} />
					<OText size={14} lineHeight={24} weight={'400'} color={colors.textNormal}>{t('MY_SAVED_PLACES', 'My saved places')}</OText>
				</ListItem>
				<ListItem onPress={() => navigation.navigate('Help', {})} activeOpacity={0.7}>
					<OIcon src={images.general.help} width={16} color={colors.textNormal} style={{marginEnd: 14}} />
					<OText size={14} lineHeight={24} weight={'400'} color={colors.textNormal}>{t('HELP', 'Help')}</OText>
				</ListItem>
			</Actions>
			
			<Actions>
				<LanguageSelector iconColor={colors.textNormal} pickerStyle={langPickerStyle} />
				<View style={{height: 17}} />
				<LogoutButton color={colors.textNormal} text={t('LOGOUT', 'Logout')} />
			</Actions>
		</ListWrap>
    </View>
  );
};

const langPickerStyle = StyleSheet.create({
	inputAndroid: {
		color: colors.textNormal,
		fontSize: 14,
		fontWeight: '500',
		paddingEnd: 24,
		paddingStart: 0,
		height: 40,
		borderWidth: 1,
		borderColor: colors.clear,
		backgroundColor: colors.clear
	 },
	 inputIOS: {
		color: colors.textNormal,
		fontSize: 14,
		fontWeight: '500',
		paddingEnd: 24,
		height: 40,
		borderWidth: 1,
		borderColor: colors.clear,
		backgroundColor: colors.clear
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
		shadowOffset: {width: 0, height: 1},
		shadowRadius: 2,
		shadowOpacity: 0.2,
		backgroundColor: colors.white,
		marginEnd: 14
	},
	pagePadding: {
		paddingLeft: 40,
		paddingRight: 40
	}
});

export const UserProfile = (props: any) => {
  const profileProps = {
    ...props,
    UIComponent: ProfileListUI,
  };
  return <UserProfileController {...profileProps} />;
};
