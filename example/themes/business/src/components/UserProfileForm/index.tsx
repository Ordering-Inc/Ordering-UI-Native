import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useForm } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';
import {
  UserFormDetails as UserProfileController,
  useSession,
  ToastType,
  useToast,
  useLanguage,
  useUtils,
} from 'ordering-components/native';
import {
  CenterView,
  Actions,
  UserData,
  EditButton,
  EnabledStatusDriver,
} from './styles';
import { LogoutButton } from '../LogoutButton';
import { LanguageSelector } from '../LanguageSelector';
import { UserFormDetailsUI } from '../UserFormDetails';
import ToggleSwitch from 'toggle-switch-react-native';
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
import { NotFoundSource } from '../NotFoundSource';

const ProfileUI = (props: ProfileParams) => {
  const {
    navigation,
    formState,
    isEdit,
    validationFields,
    handleButtonUpdateClick,
    toggleIsEdit,
    cleanFormState,
    handleToggleAvalaibleStatusDriver,
    userState,
    isAvailableLoading,
  } = props;

  const [{ user }] = useSession();
  const [state, t] = useLanguage();
  const [, { showToast }] = useToast();
  const [{ optimizeImage }] = useUtils();
  const { errors } = useForm();
  const theme = useTheme();

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

  const styles = StyleSheet.create({
    label: {
      color: theme.colors.textGray,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
    },
    inputStyle: {
      marginBottom: 25,
      borderWidth: 1,
      borderColor: theme.colors.tabBar,
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderLeftWidth: 0,
      paddingHorizontal: 0,
      borderRadius: 0,
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

  return (
    <>
      {validationFields.error && (
        <NotFoundSource
          content={t('NETWORK_ERROR', 'Network Error')}
          image={theme.images.general.notFound}
          conditioned={false}
        />
      )}

      {(formState?.loading || state?.loading) && !validationFields.error && (
        <View
          style={{
            padding: 40,
            backgroundColor: theme.colors.backgroundLight,
          }}>
          <Placeholder Animation={Fade}>
            <PlaceholderLine
              width={20}
              style={{
                alignSelf: 'center',
                borderRadius: 20,
                width: 120,
                height: 120,
              }}
            />

            <PlaceholderLine
              width={20}
              style={{
                alignSelf: 'center',
                borderRadius: 20,
                width: 20,
                height: 20,
              }}
            />
          </Placeholder>

          {[...Array(8)].map((item, i) => (
            <Placeholder key={i} Animation={Fade}>
              <View style={{ flexDirection: 'row' }}>
                <Placeholder>
                  <PlaceholderLine width={50} style={{ marginTop: 30 }} />

                  <PlaceholderLine width={90} />
                </Placeholder>
              </View>
            </Placeholder>
          ))}

          <Placeholder Animation={Fade}>
            <PlaceholderLine
              width={30}
              style={{
                marginTop: 20,
                alignSelf: 'center',
                height: 44,
                borderRadius: 7.6,
              }}
            />

            <PlaceholderLine
              width={100}
              style={{
                marginTop: 20,
                height: 33,
                borderRadius: 7.6,
              }}
            />

            <PlaceholderLine
              width={40}
              style={{
                marginTop: 5,
                height: 15,
                borderRadius: 7.6,
              }}
            />
          </Placeholder>
        </View>
      )}

      {!formState?.loading && !state?.loading && !validationFields.error && (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <CenterView>
            <OIcon
              url={optimizeImage(user?.photo, 'h_300,c_limit')}
              src={!user?.photo && theme.images.general.user}
              width={150}
              height={150}
              style={{ borderRadius: 7.2 }}
            />

            <OIconButton
              icon={theme.images.general.camera}
              borderColor={theme.colors.clear}
              iconStyle={{ width: 21, height: 21 }}
              style={{ maxWidth: 40 }}
              onClick={() => handleImagePicker()}
            />
          </CenterView>

          {user?.level === 4 && (
            <EnabledStatusDriver>
              <OText style={{ ...styles.label, paddingHorizontal: 0 }}>
                {t(
                  'AVAILABLE_TO_RECEIVE_ORDERS',
                  'Available to receive orders',
                )}
              </OText>

              {isAvailableLoading ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <ToggleSwitch
                  isOn={userState?.result?.result?.available}
                  onColor={theme.colors.primary}
                  offColor={theme.colors.offColor}
                  size="small"
                  onToggle={() =>
                    handleToggleAvalaibleStatusDriver &&
                    handleToggleAvalaibleStatusDriver(
                      !userState?.result?.result?.available,
                    )
                  }
                  disabled={userState?.loading}
                  animationSpeed={200}
                />
              )}
            </EnabledStatusDriver>
          )}

          {!isEdit && !validationFields.error ? (
            <UserData>
              {!validationFields?.loading &&
                sortInputFields({ values: validationFields?.fields?.checkout })
                  .length > 0 && (
                  <UDWrapper>
                    {sortInputFields({
                      values: validationFields.fields?.checkout,
                    }).map((field: any) => (
                      <React.Fragment key={field.id}>
                        <OText style={styles.label}>
                          {t(field?.code.toUpperCase(), field?.name)}
                        </OText>

                        <OInput
                          name={field.code}
                          placeholder={t(field.code.toUpperCase(), field?.name)}
                          placeholderTextColor={theme.colors.arrowColor}
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
                          selectionColor={theme.colors.primary}
                          color={theme.colors.textGray}
                        />
                      </React.Fragment>
                    ))}

                    <OText style={styles.label}>
                      {t('PASSWORD', 'Password')}
                    </OText>

                    <OInput
                      isSecured={true}
                      placeholder={'·············'}
                      placeholderTextColor={theme.colors.textGray}
                      style={styles.inputStyle}
                      isDisabled={true}
                      selectionColor={theme.colors.primary}
                      color={theme.colors.textGray}
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
        </ScrollView>
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
