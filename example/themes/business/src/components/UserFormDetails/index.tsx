import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'styled-components/native';
import {
  useSession,
  useLanguage,
  ToastType,
  useToast,
} from 'ordering-components/native';
import {
  UDForm,
  UDLoader,
  UDWrapper,
  WrapperPhone,
  EditButton,
} from './styles';
import { PhoneInputNumber } from '../PhoneInputNumber';
import { OText, OButton, OInput } from '../shared';
import { sortInputFields } from '../../utils';

export const UserFormDetailsUI = (props: any) => {
  const {
    isEdit,
    formState,
    showField,
    cleanFormState,
    onCloseProfile,
    isRequiredField,
    validationFields,
    handleChangeInput,
    handleButtonUpdateClick,
    phoneUpdate,
    hideUpdateButton,
    handleCancelEdit,
    toggleIsEdit,
    isCheckout,
    isAlsea,
    allowDriverUpdateData
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [, { showToast }] = useToast();
  const { handleSubmit, control, errors, setValue, watch } = useForm();

  const [{ user }] = useSession();
  const [passwordSee, setPasswordSee] = useState(false);
  const [confirmSee, setConfirmSee] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState<any>(null);
  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null,
    },
  });

  const watchPassword = watch('password');
  const watchConfirmPassword = watch('confirmPassword');

  const showInputPhoneNumber =
    validationFields?.fields?.checkout?.cellphone?.enabled ?? false;

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

  const onSubmit = (values: any) => {
    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error);
      return;
    }
    if (
      Object.keys(formState.changes).length > 0 ||
      (watchPassword.length > 0 && watchConfirmPassword.length > 0)
    ) {
      if (
        formState.changes?.cellphone === null &&
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
      let changes = null;
      if (user?.cellphone && !userPhoneNumber) {
        changes = {
          country_phone_code: '',
          cellphone: '',
        };
      }

      if (values.password && values.confirmPassword) {
        changes = {
          password: values.password,
        };
      }

      handleButtonUpdateClick(changes);
    }
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

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const list = Object.values(errors);

      if (phoneInputData.error) {
        list.push({ message: phoneInputData.error });
      }

      let stringError = '';
      list.map((item: any, i: number) => {
        stringError +=
          i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });

      showToast(ToastType.Error, stringError);
    }
  }, [errors]);

  useEffect(() => {
    if (!formState?.loading && formState?.result?.error) {
      formState.result?.result &&
        showToast(ToastType.Error, formState.result?.result[0]);
    }
  }, [formState?.loading]);

  useEffect(() => {
    if (!isEdit && onCloseProfile) {
      onCloseProfile();
    }
    if ((user || !isEdit) && !formState?.loading) {
      setUserCellPhone();
      if (!isEdit && !formState?.loading) {
        cleanFormState && cleanFormState({ changes: {} });
        setUserCellPhone(true);
      }
    }
  }, [user, isEdit]);

  const styles = StyleSheet.create({
    btnOutline: {
      backgroundColor: theme.colors.primaryContrast,
      color: theme.colors.primary,
    },
    label: {
      color: theme.colors.textGray,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
    },
    errorText: {
      color: theme.colors.error,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 16,
      paddingHorizontal: 16,
      marginBottom: 20,
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
    },
    btnText: {
      color: theme.colors.textGray,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 16,
    },
    btnFlag: {
      width: 79,
      borderWidth: 1,
      borderRadius: 7.6,
      marginRight: 9,
      borderColor: theme.colors.inputSignup,
    },
  });

  return (
    <>
      <UDForm>
        {!validationFields?.loading &&
          sortInputFields({ values: validationFields?.fields?.checkout })
            .length > 0 && (
            <UDWrapper>
              {allowDriverUpdateData && (
                <>
                  {sortInputFields({
                    values: validationFields.fields?.checkout,
                  }).map(
                    (field: any) =>
                      showField &&
                      showField(field.code) &&
                      !isAlsea
                      && (
                        <React.Fragment key={field.id}>
                          <OText style={styles.label}>
                            {t(field?.code.toUpperCase(), field?.name)}
                          </OText>

                          <Controller
                            key={field.id}
                            control={control}
                            render={() => (
                              <OInput
                                name={field.code}
                                placeholder={t(
                                  field.code.toUpperCase(),
                                  field?.name,
                                )}
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
                                onChange={(val: any) => {
                                  field.code !== 'email'
                                    ? setValue(field.code, val.target.value)
                                    : setValue(
                                      field.code,
                                      val.target.value
                                        .toLowerCase()
                                        .replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''),
                                    );
                                  field.code !== 'email'
                                    ? handleChangeInput(val)
                                    : handleChangeInput({
                                      target: {
                                        name: 'email',
                                        value: val.target.value
                                          .toLowerCase()
                                          .replace(
                                            /[&,()%";:ç?<>{}\\[\]\s]/g,
                                            '',
                                          ),
                                      },
                                    });
                                }}
                                autoCorrect={field.code === 'email' && false}
                                type={
                                  field.code === 'email'
                                    ? 'email-address'
                                    : 'default'
                                }
                                returnKeyType="done"
                                autoCompleteType={
                                  field.code === 'email' ? 'email' : 'off'
                                }
                                selectionColor={theme.colors.primary}
                                color={theme.colors.textGray}
                              />
                            )}
                            name={field.code}
                            rules={getInputRules(field)}
                            defaultValue={user && user[field.code]}
                          />
                        </React.Fragment>
                      ),
                  )}
                </>
              )}
              <OText style={styles.label}>{t('PASSWORD', 'Password')}</OText>

              <Controller
                control={control}
                render={({ onChange, value }: any) => (
                  <OInput
                    isSecured={!passwordSee ? true : false}
                    placeholder={t('PASSWORD', 'Password')}
                    placeholderTextColor={theme.colors.arrowColor}
                    style={styles.inputStyle}
                    iconCustomRight={
                      passwordSee ? (
                        <MaterialCommunityIcons
                          name="eye-outline"
                          color={theme.colors.arrowColor}
                          size={24}
                          onPress={() => setPasswordSee(!passwordSee)}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="eye-off-outline"
                          color={theme.colors.arrowColor}
                          size={24}
                          onPress={() => setPasswordSee(!passwordSee)}
                        />
                      )
                    }
                    selectionColor={theme.colors.primary}
                    color={theme.colors.textGray}
                    value={value}
                    onChange={(val: any) => onChange(val)}
                    returnKeyType="done"
                    blurOnSubmit
                  />
                )}
                name="password"
                defaultValue=""
              />

              <OText style={styles.label}>
                {t('MOBILE_CONFIRM_PASSWORD', 'Confirm Password')}
              </OText>

              <Controller
                control={control}
                render={({ onChange, value }: any) => (
                  <OInput
                    isSecured={!confirmSee ? true : false}
                    placeholder={t(
                      'MOBILE_CONFIRM_PASSWORD',
                      'Confirm Password',
                    )}
                    style={styles.inputStyle}
                    placeholderTextColor={theme.colors.arrowColor}
                    iconCustomRight={
                      confirmSee ? (
                        <MaterialCommunityIcons
                          name="eye-outline"
                          color={theme.colors.arrowColor}
                          size={24}
                          onPress={() => setConfirmSee(!confirmSee)}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="eye-off-outline"
                          color={theme.colors.arrowColor}
                          size={24}
                          onPress={() => setConfirmSee(!confirmSee)}
                        />
                      )
                    }
                    selectionColor={theme.colors.primary}
                    color={theme.colors.textGray}
                    value={value}
                    onChange={(val: any) => onChange(val)}
                    returnKeyType="done"
                    blurOnSubmit
                  />
                )}
                rules={{
                  validate: (value: any) => {
                    return (
                      watchPassword === value ||
                      t(
                        'VALIDATION_ERROR_PASSWORDS_MATCH',
                        'The passwords do not match',
                      )
                    );
                  },
                }}
                name="confirmPassword"
                defaultValue=""
              />

              {errors.confirmPassword && (
                <OText style={styles.errorText}>
                  {errors?.confirmPassword.message}
                </OText>
              )}

              {!!showInputPhoneNumber && !isAlsea && allowDriverUpdateData && (
                <WrapperPhone>
                  <PhoneInputNumber
                    data={phoneInputData}
                    handleData={(val: any) => handleChangePhoneNumber(val)}
                    defaultValue={phoneUpdate ? '' : user?.cellphone}
                    defaultCode={user?.country_phone_code || null}
                    flagProps={styles.btnFlag}
                  />

                  {phoneUpdate && (
                    <OText style={styles.errorText}>
                      {t('YOUR_PREVIOUS_CELLPHONE', 'Your previous cellphone')}:{' '}
                      {user?.cellphone}
                    </OText>
                  )}
                </WrapperPhone>
              )}
            </UDWrapper>
          )}
      </UDForm>

      {!validationFields.loading && !isCheckout && (
        <EditButton>
          <View style={{ flex: 1 }}>
            <OButton
              text={t('CANCEL', 'Cancel')}
              bgColor={theme.colors.white}
              borderColor={theme.colors.primary}
              style={styles.editButton}
              textStyle={styles.btnText}
              isDisabled={formState.loading}
              imgRightSrc={null}
              onClick={handleCancelEdit}
            />
          </View>

          {((formState &&
            Object.keys(formState?.changes).length > 0 &&
            isEdit) ||
            (watchPassword?.length > 0 && watchConfirmPassword?.length > 0) ||
            formState?.loading) && (
              <View style={{ flex: 1, marginLeft: 5 }}>
                <OButton
                  text={
                    formState.loading
                      ? t('UPDATING', 'Updating')
                      : t('UPDATE', 'Update')
                  }
                  bgColor={theme.colors.primary}
                  textStyle={{
                    ...styles.btnText,
                    color: formState.loading
                      ? theme.colors.textGray
                      : theme.colors.white,
                  }}
                  borderColor={theme.colors.primary}
                  isDisabled={formState.loading}
                  imgRightSrc={null}
                  style={styles.editButton}
                  onClick={handleSubmit(onSubmit)}
                />
              </View>
            )}
        </EditButton>
      )}
    </>
  );
};
