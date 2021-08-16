import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { useTheme } from 'styled-components/native';
import {
  UserFormDetails as UserProfileController,
  useSession,
  ToastType,
  useToast,
  useLanguage,
} from 'ordering-components/native';
import { CenterView, Actions, UserData, EditButton } from './styles';
import NavBar from '../NavBar';
import { LogoutButton } from '../LogoutButton';
import { LanguageSelector } from '../LanguageSelector';
import { UserFormDetailsUI } from '../UserFormDetails';
import { UDWrapper } from '../UserFormDetails/styles';
import {
  OIcon,
  OIconButton,
  OText,
  OButton,
  OInput,
} from '../../components/shared';
import { sortInputFields } from '../../utils';
import { ProfileParams } from '../../types';

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
  const [state, t] = useLanguage();
  const [, { showToast }] = useToast();
  const { errors } = useForm();
  const theme = useTheme();

  const styles = StyleSheet.create({
    inputStyle: {
      marginBottom: 25,
      borderWidth: 1,
      borderColor: theme.colors.tabBar,
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderLeftWidth: 0,
    },
    editButton: {
      height: 44,
      borderRadius: 7.6,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.white,
      marginBottom: 25,
    },
    btnText: {
      color: theme.colors.textGray,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
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

      <Spinner visible={formState?.loading || state?.loading} />

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

                <OText
                  color={theme.colors.textGray}
                  weight="bold"
                  style={{ paddingHorizontal: 16 }}>
                  {t('PASSWORD', 'Password')}
                </OText>

                <OInput
                  isSecured={true}
                  placeholder={'·············'}
                  style={styles.inputStyle}
                  isDisabled={true}
                />
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
            textStyle={styles.btnText}
            style={styles.editButton}
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
