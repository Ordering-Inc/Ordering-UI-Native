import React, { useEffect, useState } from 'react';
import {
  UserFormDetails as UserProfileController,
  useSession,
  useLanguage,
  ToastType,
  useToast
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { useForm } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { StyleSheet, View } from 'react-native';
import { ProfileParams } from '../../types';
import { AddressList } from '../AddressList'
import { LogoutButton } from '../LogoutButton'
import { LanguageSelector } from '../LanguageSelector'
import { UserFormDetailsUI } from '../UserFormDetails'

import {
  OIcon,
  OIconButton,
  OText,
  OButton,
} from '../../components/shared';
import {
  CenterView,
  UserData,
  Names,
  EditButton,
  Actions
} from './styles';

const ProfileUI = (props: ProfileParams) => {
  const {
    navigation,
    isEdit,
    formState,
    validationFields,
    isRequiredField,
    toggleIsEdit,
    cleanFormState,
    handleChangeInput,
    handleButtonUpdateClick
  } = props;

  const theme = useTheme();

  const styles = StyleSheet.create({
    dropdown: {
      borderColor: theme.colors.whiteGray,
      height: 50,
      borderRadius: 25,
      marginTop: 16,
    },
    inputbox: {
      marginVertical: 8,
      width: '90%'
    },
    editButton: {
      borderRadius: 25,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.white,
      borderWidth: 1,
      color: theme.colors.primary,
      marginVertical: 8,
    },
  });

  const [{ user }] = useSession();
  const [, t] = useLanguage();
  const [, { showToast }] = useToast();
  const { handleSubmit, errors } = useForm();

  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null
    }
  });
  const [phoneUpdate, setPhoneUpdate] = useState(false)

  const onSubmit = (values: any) => {
    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error)
      return
    }
    if (
      formState.changes.cellphone === '' &&
      validationFields?.fields?.checkout?.cellphone?.enabled &&
      validationFields?.fields?.checkout?.cellphone?.required
    ) {
      showToast(
        ToastType.Error,
        t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Phone Number is required.')
      );
      return
    }
    if (formState.changes.password && formState.changes.password.length < 8) {
      showToast(ToastType.Error, t('VALIDATION_ERROR_PASSWORD_MIN_STRING', 'The Password must be at least 8 characters.').replace('_attribute_', t('PASSWORD', 'Password')).replace('_min_', 8))
      return
    }

    handleButtonUpdateClick(values);
  }

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo', maxHeight: 200, maxWidth: 200, includeBase64: true }, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        showToast(ToastType.Error, response.errorMessage);
      } else {
        if (response.uri) {
          const url = `data:${response.type};base64,${response.base64}`
          handleButtonUpdateClick(null, true, url);
        } else {
          showToast(ToastType.Error, t('IMAGE_NOT_FOUND', 'Image not found'));
        }
      }
    });
  };

  const handleCancelEdit = () => {
    cleanFormState({ changes: {} });
    toggleIsEdit();
    setPhoneInputData({
      error: '',
      phone: {
        country_phone_code: null,
        cellphone: null
      }
    })
  };

  const handleChangePhoneNumber = (number: any) => {
    setPhoneInputData(number)
    let phoneNumber = {
      country_phone_code: {
        name: 'country_phone_code',
        value: number.phone.country_phone_code
      },
      cellphone: {
        name: 'cellphone',
        value: number.phone.cellphone
      }
    }
    handleChangeInput(phoneNumber, true)
  }

  const getInputRules = (field: any) => {
    const rules: any = {
      required: isRequiredField(field.code)
        ? t(`VALIDATION_ERROR_${field.code.toUpperCase()}_REQUIRED`, `${field.name} is required`)
          .replace('_attribute_', t(field.name, field.code))
        : null
    }
    if (field.code && field.code === 'email') {
      rules.pattern = {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: t('INVALID_ERROR_EMAIL', 'Invalid email address').replace('_attribute_', t('EMAIL', 'Email'))
      }
    }
    return rules
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

  useEffect(() => {
    if (user?.cellphone && !user?.country_phone_code) {
      setPhoneUpdate(true)
    } else {
      setPhoneUpdate(false)
    }
  }, [user?.country_phone_code])

  return (
    <>
      <Actions>
        <LanguageSelector />
        <LogoutButton />
      </Actions>
      <CenterView>
        <OIcon
          url={user?.photo}
          src={!user?.photo && theme.images.general.user}
          width={100}
          height={100}
          style={{ borderRadius: 12 }}
        />
        <OIconButton
          icon={theme.images.general.camera}
          borderColor={theme.colors.clear}
          iconStyle={{ width: 30, height: 30 }}
          style={{ maxWidth: 40 }}
          onClick={() => handleImagePicker()}
        />
      </CenterView>
      <Spinner visible={formState?.loading} />
      {!isEdit ? (
        <UserData>
          <Names>
            <OText space>{user?.name}</OText>
            <OText>{user?.lastname}</OText>
          </Names>
          {(!!user?.middle_name || !!user?.second_lastname) && (
            <Names>
              <OText space>{user?.middle_name}</OText>
              <OText>{user?.second_lastname}</OText>
            </Names>
          )}
          <OText>{user?.email}</OText>
          {!!user?.cellphone && <OText>{user?.cellphone}</OText>}
          {!!phoneUpdate && (
            <OText
              color={theme.colors.error}
            >
              {t('NECESSARY_UPDATE_COUNTRY_PHONE_CODE', 'It is necessary to update your phone number')}
            </OText>
          )}
        </UserData>
      ) : (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <UserFormDetailsUI
            {...props}
            hideUpdateButton
            handleCancelEdit={handleCancelEdit}
            toggleIsEdit={toggleIsEdit}
          />
        </View>
      )}
      {!validationFields.loading && !isEdit && (
        <EditButton>
          <OButton
            text={t('EDIT', 'Edit')}
            bgColor={theme.colors.white}
            borderColor={theme.colors.primary}
            isDisabled={formState.loading}
            imgRightSrc={null}
            textStyle={{ fontSize: 20 }}
            style={{ ...styles.editButton }}
            onClick={toggleIsEdit}
          />
        </EditButton>
      )}
      {user?.id && (
        <AddressList
          nopadding
          isFromProfile
          userId={user.id}
          navigation={navigation}
        />
      )}
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
