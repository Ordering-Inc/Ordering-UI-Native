import React, { useEffect, useState } from 'react';
import {
  UserFormDetails as UserProfileController,
  useSession,
  useLanguage,
} from 'ordering-components/native';
import { useForm, Controller } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { StyleSheet, View } from 'react-native';
import { IMAGES } from '../../config/constants';
import { colors } from '../../theme.json';
import { ToastType, useToast } from '../../providers/ToastProvider';
import { ProfileParams } from '../../types';
import { sortInputFields } from '../../utils';
import { AddressList } from '../AddressList'
import { LogoutButton } from '../LogoutButton'
import { LanguageSelector } from '../LanguageSelector'
import { PhoneInputNumber } from '../PhoneInputNumber'

import {
  OIcon,
  OIconButton,
  OInput,
  OText,
  OButton,
} from '../../components/shared';
import {
  CenterView,
  UserData,
  Names,
  EditButton,
  Actions,
  WrapperPhone
} from './styles';

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
    handleButtonUpdateClick
  } = props;

  const [{ user }] = useSession();
  const [, t] = useLanguage();
  const { showToast } = useToast();
  const { handleSubmit, errors, setValue, control } = useForm();

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
    launchImageLibrary({ mediaType: 'photo', maxHeight: 200, maxWidth: 200, includeBase64: true }, (response) => {
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
          width={100}
          height={100}
          style={{ borderRadius: 12 }}
        />
        <OIconButton
          icon={IMAGES.camera}
          borderColor={colors.clear}
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
              color={colors.error}
            >
              {t('NECESSARY_UPDATE_COUNTRY_PHONE_CODE', 'It is necessary to update your phone number')}
            </OText>
          )}
        </UserData>
      ) : (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {sortInputFields({ values: validationFields.fields?.checkout }).map((field: any) =>
            showField && showField(field.code) && (
              <Controller
                key={field.id}
                control={control}
                render={() => (
                  <OInput
                    key={field.id}
                    name={field.code}
                    placeholder={t(field.code.toUpperCase(), field?.name)}
                    icon={field.code === 'email' ? IMAGES.email : IMAGES.user}
                    borderColor={colors.whiteGray}
                    style={styles.inputbox}
                    onChange={(val: any) => {
                      field.code !== 'email' ? setValue(field.code, val.target.value) : setValue(field.code, val.target.value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''))
                      field.code !== 'email' ? handleChangeInput(val) : handleChangeInput({ target: { name: 'email', value: val.target.value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, '') } })
                    }}
                    value={user && user[field.code]}
                    autoCapitalize={field.code === 'email' ? 'none' : 'sentences'}
                    autoCorrect={field.code === 'email' && false}
                    type={field.code === 'email' ? 'email-address' : ''}
                  />
                )}
                name={field.code}
                defaultValue={user && user[field.code]}
                rules={getInputRules(field)}
              />
            )
          )}
          <WrapperPhone>
            <PhoneInputNumber
              data={phoneInputData}
              handleData={(val: any) => handleChangePhoneNumber(val)}
              defaultValue={phoneUpdate ? '' : user?.cellphone}
            />
            {phoneUpdate && (
              <OText
                color={colors.error}
                style={{ marginHorizontal: 10, textAlign: 'center' }}
              >
                {t('YOUR_PREVIOUS_CELLPHONE', 'Your previous cellphone')}: {user?.cellphone}
              </OText>
            )}
          </WrapperPhone>
          <OInput
            name='password'
            isSecured={true}
            placeholder={t('PASSWORD', 'Password')}
            icon={IMAGES.lock}
            borderColor={colors.whiteGray}
            style={styles.inputbox}
            onChange={(val: any) => {
              handleChangeInput(val)
            }}
          />
        </View>
      )}
      {!validationFields.loading && (
        <EditButton>
          {!isEdit ? (
            <OButton
              text={t('EDIT', 'Edit')}
              bgColor={colors.white}
              borderColor={colors.primary}
              isDisabled={formState.loading}
              imgRightSrc={null}
              textStyle={{ fontSize: 20 }}
              style={{ ...styles.editButton }}
              onClick={toggleIsEdit}
            />
          ) : (
            <>
              <View style={{ flex: 1 }}>
                <OButton
                  text={t('CANCEL', 'Cancel')}
                  bgColor={colors.white}
                  borderColor={colors.primary}
                  isDisabled={formState.loading}
                  imgRightSrc={null}
                  style={{ ...styles.editButton }}
                  onClick={handleCancelEdit}
                />
              </View>
              {((formState &&
                Object.keys(formState?.changes).length > 0 && isEdit) || formState?.loading) &&
              (
                <View style={{ flex: 1, marginLeft: 5 }}>
                  <OButton
                    text={formState.loading ? t('UPDATING', 'Updating...') : t('UPDATE', 'Update')}
                    bgColor={colors.primary}
                    textStyle={{ color: formState.loading ? 'black' : 'white' }}
                    borderColor={colors.primary}
                    isDisabled={formState.loading}
                    imgRightSrc={null}
                    style={{ ...styles.editButton }}
                    onClick={handleSubmit(onSubmit)}
                  />
                </View>
              )}
            </>
          )}
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

const styles = StyleSheet.create({
  dropdown: {
    borderColor: colors.whiteGray,
    height: 50,
    borderRadius: 25,
    marginTop: 16,
  },
  inputbox: {
    marginVertical: 8,
    width: '90%'
  },
  editButton: {
    // flex:0,
    borderRadius: 25,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    borderWidth: 1,
    color: colors.primary,
    // width: 100,
    // height: 50,
    marginVertical: 8,
    // flex: 1,
  },
});

export const UserProfileForm = (props: any) => {
  const profileProps = {
    ...props,
    UIComponent: ProfileUI,
  };
  return <UserProfileController {...profileProps} />;
};
