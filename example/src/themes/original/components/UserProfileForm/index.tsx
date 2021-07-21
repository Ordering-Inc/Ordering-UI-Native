import React, { useEffect, useState } from 'react';
import {
  UserFormDetails as UserProfileController,
  useSession,
  useLanguage,
} from 'ordering-components/native';
import { useForm } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { StyleSheet, View } from 'react-native';
import { colors, images } from '../../theme.json';
import { ToastType, useToast } from '../../../../providers/ToastProvider';
import { ProfileParams } from '../../../../types';
import { UserFormDetailsUI } from '../UserFormDetails';

import { OIcon, OIconButton } from '../../../../components/shared';
import { CenterView } from './styles';
import NavBar from '../NavBar';

const ProfileUI = (props: ProfileParams) => {
  const {
    navigation,
    isEdit,
    formState,
    validationFields,
    showField,
    isRequiredField,
    toggleIsEdit,
    cleanFormState,
    handleChangeInput,
    handleButtonUpdateClick,
  } = props;

  const [{ user }] = useSession();
  const [, t] = useLanguage();
  const { showToast } = useToast();
  const { handleSubmit, errors, setValue, control } = useForm();

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
      (response: any) => {
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

  const handleCancelEdit = () => {
    cleanFormState({ changes: {} });
    toggleIsEdit();
    setPhoneInputData({
      error: '',
      phone: {
        country_phone_code: null,
        cellphone: null,
      },
    });
  };

  const handleChangePhoneNumber = (number: any) => {
    setPhoneInputData(number);
    let phoneNumber = {
      country_phone_code: {
        name: 'country_phone_code',
        value: number.phone.country_phone_code,
      },
      cellphone: {
        name: 'cellphone',
        value: number.phone.cellphone,
      },
    };
    handleChangeInput(phoneNumber, true);
  };

  const getInputRules = (field: any) => {
    const rules: any = {
      required: isRequiredField(field.code)
        ? t(
            `VALIDATION_ERROR_${field.code.toUpperCase()}_REQUIRED`,
            `${field.name} is required`,
          ).replace('_attribute_', t(field.name, field.code))
        : null,
    };
    if (field.code && field.code === 'email') {
      rules.pattern = {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: t('INVALID_ERROR_EMAIL', 'Invalid email address').replace(
          '_attribute_',
          t('EMAIL', 'Email'),
        ),
      };
    }
    return rules;
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
    <View>
      <NavBar
        onActionLeft={() => navigation.goBack()}
        btnStyle={{ paddingStart: 0 }}
        title={t('ACCOUNT', 'Account')}
        isVertical
      />
      <CenterView>
			<View style={styles.photo}>
				<OIcon
					url={user?.photo}
					src={!user?.photo && images.general.user}
					width={79}
					height={79}
				/>
			</View>
        <OIconButton
          icon={images.general.camera}
          borderColor={colors.clear}
          iconStyle={{ width: 16, height: 16 }}
          style={{ maxWidth: 40, position: 'absolute', bottom: -2, alignSelf: 'center' }}
          onClick={() => handleImagePicker()}
        />
      </CenterView>
		<View style={{height: 8, marginHorizontal: -40, backgroundColor: colors.backgroundGray100, marginVertical: 32}} />
      <Spinner visible={formState?.loading} />
      <View>
         <UserFormDetailsUI {...props} isEdit />
		</View>
      
    </View>
  );
};

const styles = StyleSheet.create({
	photo: {
		borderRadius: 7.6,
		shadowColor: colors.black,
		shadowOffset: {width: 0, height: 1},
		shadowRadius: 2,
		shadowOpacity: 0.2,
		backgroundColor: colors.white,
	},
});

export const UserProfileForm = (props: any) => {
  const profileProps = {
    ...props,
    UIComponent: ProfileUI,
  };
  return <UserProfileController {...profileProps} />;
};
