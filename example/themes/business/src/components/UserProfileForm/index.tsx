import React, { useEffect, useState } from 'react';
import {
  ToastType,
  useToast,
  UserFormDetails as UserProfileController,
  useSession,
  useLanguage,
} from 'ordering-components/native';
import { useForm } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { View } from 'react-native';
import { ProfileParams } from '../../types';
import { LogoutButton } from '../LogoutButton';
import { LanguageSelector } from '../LanguageSelector';
import { UserFormDetailsUI } from '../UserFormDetails';
import { useTheme } from 'styled-components/native';
import { OIcon, OIconButton } from '../../components/shared';
import { CenterView, Actions } from './styles';
import NavBar from '../NavBar';

const ProfileUI = (props: ProfileParams) => {
  const { navigation, formState, validationFields, handleButtonUpdateClick } =
    props;

  const [{ user }] = useSession();
  const [state, t] = useLanguage();
  const [, { showToast }] = useToast();
  const { handleSubmit, errors } = useForm();
  const theme = useTheme();

  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null,
    },
  });
  const [phoneUpdate, setPhoneUpdate] = useState(false);

  const onSubmit = (values: any) => {
    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error);
      return;
    }
    if (
      formState.changes.cellphone === '' &&
      validationFields?.fields?.checkout?.cellphone?.enabled &&
      validationFields?.fields?.checkout?.cellphone?.required
    ) {
      showToast(
        ToastType.Error,
        t(
          'VALIDATION_ERROR_MOBILE_PHONE_REQUIRED',
          'The field Phone Number is required.',
        ),
      );
      return;
    }
    if (formState.changes.password && formState.changes.password.length < 8) {
      showToast(
        ToastType.Error,
        t(
          'VALIDATION_ERROR_PASSWORD_MIN_STRING',
          'The Password must be at least 8 characters.',
        )
          .replace('_attribute_', t('PASSWORD', 'Password'))
          .replace('_min_', 8),
      );
      return;
    }

    handleButtonUpdateClick(values);
  };

  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxHeight: 200,
        maxWidth: 200,
        includeBase64: true,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
          showToast(ToastType.Error, response.errorMessage);
        } else {
          if (response.uri) {
            const url = `data:${response.type};base64,${response.base64}`;
            handleButtonUpdateClick(null, true, url);
          } else {
            showToast(ToastType.Error, t('IMAGE_NOT_FOUND', 'Image not found'));
          }
        }
      },
    );
  };

  useEffect(() => {
    if (formState.result.result && !formState.loading) {
      if (formState.result?.error) {
        showToast(ToastType.Error, formState.result.result);
      } else {
        showToast(
          ToastType.Success,
          t('UPDATE_SUCCESSFULLY', 'Update successfully'),
        );
      }
    }
  }, [formState.result]);

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

  useEffect(() => {
    if (user?.cellphone && !user?.country_phone_code) {
      setPhoneUpdate(true);
    } else {
      setPhoneUpdate(false);
    }
  }, [user?.country_phone_code]);

  return (
    <>
      <NavBar
        title={t('PROFILE', 'Profile')}
        titleAlign={'center'}
        onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
        showCall={false}
        btnStyle={{ paddingLeft: 0, display: 'none' }}
        paddingTop={0}
        titleStyle={{
          color: theme.colors.textGray,
          fontWeight: 'bold',
          fontSize: 26,
        }}
      />

      <CenterView>
        <OIcon
          url={user?.photo}
          src={!user?.photo && theme.images.general.profilephoto}
          width={120}
          height={120}
          style={{ borderRadius: 2 }}
        />

        <OIconButton
          icon={theme.images.general.camera}
          borderColor={theme.colors.clear}
          iconStyle={{ width: 16, height: 16 }}
          style={{ maxWidth: 40 }}
          onClick={() => handleImagePicker()}
        />
      </CenterView>

      <Spinner visible={formState?.loading || state.loading} />

      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <UserFormDetailsUI
          {...props}
          isEdit={true}
          hideUpdateButton
          submitEvent={handleSubmit(onSubmit)}
        />
      </View>

      <Actions>
        <LanguageSelector />
        <LogoutButton />
      </Actions>
    </>
  );
};

export const UserProfileForm = (props: any) => {
  const profileProps = {
    ...props,
    UIComponent: ProfileUI,
  };
  return <UserProfileController {...profileProps} />;
};
