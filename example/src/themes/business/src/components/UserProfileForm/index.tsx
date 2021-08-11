import React, { useEffect, useState } from 'react';
import {
  UserFormDetails as UserProfileController,
  useSession,
  useLanguage,
  ToastType,
  useToast,
} from 'ordering-components/native';
import { useForm } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { View, StyleSheet } from 'react-native';
import { ProfileParams } from '../../types';
import { LogoutButton } from '../LogoutButton';
import { LanguageSelector } from '../LanguageSelector';
import { UserFormDetailsUI } from '../UserFormDetails';
import { useTheme } from 'styled-components/native';
import {
  OIcon,
  OIconButton,
  OText,
  OButton,
  OInput,
} from '../../components/shared';
import {
  CenterView,
  Actions,
  UserData,
  Names,
  EditButton,
  WrapperPhone,
  UDForm,
} from './styles';
import { PhoneInputNumber } from '../PhoneInputNumber';
import { sortInputFields } from '../../utils';
import NavBar from '../NavBar';
import { UDWrapper } from '../UserFormDetails/styles';

const ProfileUI = (props: ProfileParams) => {
  const {
    navigation,
    formState,
    isEdit,
    validationFields,
    handleButtonUpdateClick,
    toggleIsEdit,
    cleanFormState,
  } = props;

  const [{ user }] = useSession();
  const [, t] = useLanguage();
  const [, { showToast }] = useToast();
  const { handleSubmit, errors, setValue, control } = useForm();

  const theme = useTheme();

  const styles = StyleSheet.create({
    dropdown: {
      borderColor: theme.colors.whiteGray,
      height: 50,
      borderRadius: 25,
      marginTop: 16,
    },
    inputStyle: {
      marginBottom: 25,
      borderWidth: 1,
      borderColor: theme.colors.tabBar,
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderLeftWidth: 0,
    },
    inputbox: {
      marginVertical: 8,
      width: '90%',
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

  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null,
    },
  });
  const [phoneUpdate, setPhoneUpdate] = useState(false);
  const showInputPhoneNumber =
    validationFields?.fields?.checkout?.cellphone?.enabled ?? false;

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
          src={!user?.photo && theme.images.general.user}
          width={100}
          height={100}
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
      <Spinner visible={formState?.loading} />

      {!isEdit ? (
        <UserData>
          {!validationFields?.loading &&
            sortInputFields({ values: validationFields?.fields?.checkout })
              .length > 0 && (
              <UDWrapper>
                {sortInputFields({
                  values: validationFields.fields?.checkout,
                }).map((field: any) => (
                  <React.Fragment key={field.id}>
                    <OText
                      color={theme.colors.textGray}
                      weight="bold"
                      style={{ paddingHorizontal: 16 }}>
                      {t(field?.code.toUpperCase(), field?.name)}
                    </OText>
                    <OInput
                      name={field.code}
                      placeholder={t(field.code.toUpperCase(), field?.name)}
                      style={styles.inputStyle}
                      icon={
                        field.code === 'email'
                          ? theme.images.general.email
                          : theme.images.general.user
                      }
                      autoCapitalize={
                        field.code === 'email' ? 'none' : 'sentences'
                      }
                      isDisabled={!isEdit}
                      value={
                        formState?.changes[field.code] ??
                        (user && user[field.code]) ??
                        ''
                      }
                      type={
                        field.code === 'email' ? 'email-address' : 'default'
                      }
                      returnKeyType="done"
                    />
                  </React.Fragment>
                ))}
              </UDWrapper>
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
    refreshSessionUser: true,
    UIComponent: ProfileUI,
  };
  return <UserProfileController {...profileProps} />;
};
