import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { _retrieveStoreData, _clearStoreData } from '../../providers/StoreUtil';
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
  useConfig,
  useValidationFields
} from 'ordering-components/native';
import {
  CenterView,
  Actions,
  UserData,
  EditButton,
  EnabledStatusDriver,
  RemoveAccount
} from './styles';
import { LogoutButton } from '../LogoutButton';
import { LanguageSelector } from '../LanguageSelector';
import { UserFormDetailsUI } from '../UserFormDetails';
import { DriverSchedule } from '../DriverSchedule'
import { PrinterSettings } from '../PrinterSettings'
import ToggleSwitch from 'toggle-switch-react-native';
import { UDWrapper } from '../UserFormDetails/styles';
import {
  OIcon,
  OIconButton,
  OText,
  OButton,
  OInput,
  OModal,
} from '../../components/shared';
import { OAlert } from '../../../../../src/components/shared'

import { sortInputFields, getTraduction } from '../../utils';
import { ProfileParams } from '../../types';
import { NotFoundSource } from '../NotFoundSource';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
const ProfileUI = (props: ProfileParams) => {
  const {
    formState,
    isEdit,
    validationFields,
    handleButtonUpdateClick,
    toggleIsEdit,
    cleanFormState,
    handleToggleAvalaibleStatusDriver,
    handleRemoveAccount,
    isAlsea,
    isShowDriverStatus,
    navigation
  } = props;

  const [{ user, sessionLoading }] = useSession();
  const [, t] = useLanguage();
  const [, { showToast }] = useToast();
  const [{ optimizeImage }] = useUtils();
  const [{ configs }] = useConfig();
  const [{ loading }, { loadOriginalValidationFields }] = useValidationFields()
  const { errors } = useForm();
  const theme = useTheme();
  const [confirm, setConfirm] = useState<any>({ open: false, content: null, handleOnAccept: null, id: null, title: null })

  const [phoneInputData, setPhoneInputData] = useState<any>({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null,
    },
  });
  const [phoneUpdate, setPhoneUpdate] = useState(false);
  const [userState, setUserState] = useState(props.userState)
  const [userPhoneNumber, setUserPhoneNumber] = useState<any>(null);
  const [phoneToShow, setPhoneToShow] = useState('');
  const [openModal, setOpenModal] = useState(false)
  const allowDriverUpdateData = user?.level !== 4 || configs?.allow_driver_update_data?.value === "1"
  const allowDeleteDriverAccount = user?.level !== 4 || configs?.allow_delete_driver_account?.value === "1"
  const isAdmin = user?.level === 0

  const setUserCellPhone = (isEdit = false) => {
    if (userPhoneNumber && !userPhoneNumber.includes('null') && !isEdit) {
      setUserPhoneNumber(userPhoneNumber);
      return;
    }
    if (user?.cellphone) {
      let phone = null;
      if (user?.country_phone_code) {
        phone = `+${user?.country_phone_code} ${user?.cellphone}`;
      } else {
        phone = user?.cellphone;
      }
      setUserPhoneNumber(phone);
      setPhoneInputData({
        ...phoneInputData,
        phone: {
          country_phone_code: user?.country_phone_code || null,
          cellphone: user?.cellphone || null,
        },
      });
      return;
    }
    setUserPhoneNumber(user?.cellphone || '');
  };

  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxHeight: 200,
        maxWidth: 200,
        includeBase64: true,
      },
      (image: any) => {
        const response = image?.assets?.[0];
        if (response?.didCancel) {
          console.log('User cancelled image picker');
        } else if (response?.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
          showToast(ToastType.Error, response.errorMessage);
        } else {
          if (response?.uri) {
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

  const onRemoveAccount = async () => {
    setConfirm({
      open: true,
      content: [t('QUESTION_REMOVE_ACCOUNT', 'Are you sure that you want to remove your account?')],
      title: t('ACCOUNT_ALERT', 'Account alert'),
      handleOnAccept: () => {
        setConfirm({ ...confirm, open: false })
        handleRemoveAccount && handleRemoveAccount(user?.id)
        _clearStoreData({ excludedKeys: ['isTutorial', 'language'] });
        props?.setRootState && props?.setRootState({ isAuth: false, token: null })
      }
    })
  }

  useEffect(() => {
    if (phoneInputData.phone.cellphone) {
      const codeNumberPhone = phoneInputData.phone.country_phone_code
      const numberPhone = phoneInputData.phone.cellphone
      setPhoneToShow(`(${codeNumberPhone}) ${numberPhone}`);
    }
  }, [phoneInputData.phone.cellphone]);

  useEffect(() => {
    const isLoadingDriver = userState?.loadingDriver ?? true;

    if (userState?.result?.result && !isLoadingDriver) {
      if (userState?.result?.error) {
        const messageError =
          userState.result.error || userState.result.error[0];
          showToast(ToastType.Error, typeof messageError === 'string' ? getTraduction(messageError, t) : t('CANNOT_UPDATE_AVAILABLE_STATE', 'Cannot update available state'));
        } else {
        showToast(
          ToastType.Success,
          t('AVAILABLE_STATE_IS_UPDATED', 'Available state is updated'),
        );
      }
    }
  }, [userState?.loadingDriver]);

  useEffect(() => {
    if ((user || !isEdit) && !formState?.loading) {
      setUserCellPhone();
      if (!isEdit && !formState?.loading) {
        cleanFormState && cleanFormState({ changes: {} });
        setUserCellPhone(true);
      }
    }
  }, [user, isEdit]);

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

  useEffect(() => {
    setUserState({ ...userState, ...props.userState })
  }, [props.userState])

  useEffect(() => {
    if (!user?.id) return

    setUserState({
      ...userState,
      result: {
        error: true,
        result: user
      }
    })
  }, [user, props.isFocused])

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
      {validationFields?.error && !loading && (
        <NotFoundSource
          content={
            validationFields?.error?.[0] ||
            validationFields?.error?.[0]?.message ||
            t('NETWORK_ERROR', 'Network Error')
          }
          image={theme.images.general.notFound}
          conditioned={false}
          onClickButton={() => loadOriginalValidationFields({ forceLoading: true })}
          btnTitle={t('REFRESH_PROFILE', 'Refresh profile')}
        />
      )}

      {(formState?.loading || sessionLoading) && !validationFields.error && (
        <View
          style={{
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
                  <PlaceholderLine width={40} style={{ marginTop: 30 }} />

                  <PlaceholderLine width={100} />
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

      {!(formState?.loading || sessionLoading) && !validationFields.error && (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <CenterView>
            <OIcon
              url={optimizeImage(user?.photo, 'h_300,c_limit')}
              src={!user?.photo && theme.images.general.user}
              width={150}
              height={150}
              style={{ borderRadius: 7.2 }}
            />
            {allowDriverUpdateData && (
              <OIconButton
                icon={theme.images.general.camera}
                borderColor={theme.colors.clear}
                iconStyle={{ width: 21, height: 21 }}
                style={{ maxWidth: 40 }}
                onClick={() => handleImagePicker()}
              />
            )}
          </CenterView>

          {user?.level === 4 && (
            <EnabledStatusDriver>
              <View style={{ flex: 1 }}>
                <OText
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  style={{ ...styles.label, paddingHorizontal: 0 }}>
                  {t(
                    `${!isShowDriverStatus ? 'NOT_' : ''}AVAILABLE_TO_RECEIVE_ORDERS`,
                    `${!isShowDriverStatus ? 'You are not ' : ''}Available to receive orders`
                  )}
                </OText>
              </View>

              {isShowDriverStatus && (
                <>
                  {userState.loadingDriver ? (
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
                </>
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

                    <OText style={styles.label}>{t('PHONE', 'Phone')}</OText>
                    <OInput
                      isSecured={true}
                      placeholder={
                        phoneToShow || `${t('NOT_PHONE', 'Not Phone')}`
                      }
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
                isAlsea={isAlsea}
              />
            </View>
          )}
          {!validationFields.loading && !isEdit && allowDriverUpdateData && (
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
          {!props.isBusinessApp ? (
            <Pressable style={{ marginBottom: 10 }} onPress={() => setOpenModal(true)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <OText size={16}>{t('SCHEDULE', 'Schedule')}</OText>
                <AntDesignIcon size={18} name='right' />
              </View>
              <View style={{
                borderBottomColor: theme.colors.tabBar,
                borderBottomWidth: 1,
                marginTop: 10
              }} />
            </Pressable>
          ) : (
            <Pressable style={{ marginBottom: 10 }} onPress={() => navigation.navigate('PrinterSetup')}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <OText size={16}>{t('PRINTER_SETTINGS', 'Printer Settings')}</OText>
                <AntDesignIcon size={18} name='right' />
              </View>
              <View style={{
                borderBottomColor: theme.colors.tabBar,
                borderBottomWidth: 1,
                marginTop: 10
              }} />
            </Pressable>
          )}
          <Pressable style={{ marginBottom: 10 }} onPress={() => navigation.navigate('Sessions')}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <OText size={16}>{t('SESSIONS', 'Sessions')}</OText>
              <AntDesignIcon size={18} name='right' />
            </View>
            <View style={{
              borderBottomColor: theme.colors.tabBar,
              borderBottomWidth: 1,
              marginTop: 10
            }} />
          </Pressable>
          <Actions>
            <LanguageSelector />

            <LogoutButton setRootState={props.setRootState} />
          </Actions>
          {allowDeleteDriverAccount && (
            <RemoveAccount disabled={isAdmin} onPress={() => onRemoveAccount()} activeOpacity={0.7}>
              <AntDesignIcon size={16} name='close' color={theme.colors.textNormal} style={{ marginEnd: 14 }} />
              <OText size={14} lineHeight={24} weight={'400'} style={{ opacity: isAdmin ? 0.5 : 1 }} color={theme.colors.danger500}>{t('REMOVE_ACCOUNT', 'Remove account')}</OText>
            </RemoveAccount>
          )}
          <OModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            entireModal
            hideIcons
          >
            {!props.isBusinessApp && (
              <DriverSchedule schedule={user?.schedule} />
            )}
          </OModal>
          <OAlert
            open={confirm.open}
            title={confirm.title}
            content={confirm.content}
            onAccept={confirm.handleOnAccept}
            onCancel={() => setConfirm({ ...confirm, open: false, title: null })}
            onClose={() => setConfirm({ ...confirm, open: false, title: null })}
          />
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
