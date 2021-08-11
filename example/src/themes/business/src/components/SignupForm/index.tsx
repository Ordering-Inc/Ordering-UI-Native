import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  SignupForm as SignUpController,
  useLanguage,
  ToastType,
  useToast,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { FormInput } from './styles';
import { PhoneInputNumber } from '../PhoneInputNumber';
import { VerifyPhone } from '../VerifyPhone';
import { OButton, OInput, OModal, OIconButton, OText } from '../shared';
import { _removeStoreData } from '../../providers/StoreUtil';
import { SignupParams } from '../../types';
import { sortInputFields } from '../../utils';

const SignupFormUI = (props: SignupParams) => {
  const {
    navigation,
    formState,
    validationFields,
    showField,
    isRequiredField,
    useSignupByCellphone,
    handleSuccessSignup,
    handleButtonSignupClick,
    verifyPhoneState,
    checkPhoneCodeState,
    setCheckPhoneCodeState,
    handleSendVerifyCode,
    handleCheckPhoneCode,
    // notificationState,
  } = props;

  const notValidationFields = [
    'coupon',
    'driver_tip',
    'mobile_phone',
    'address',
    'address_notes',
    'middle_name',
    'lastname',
    'second_lastname',
  ];

  const showInputPhoneNumber =
    validationFields?.fields?.checkout?.cellphone?.enabled ?? false;

  const theme = useTheme();
  const [, { showToast }] = useToast();
  const [, t] = useLanguage();
  const { control, handleSubmit, errors } = useForm();

  const [passwordSee, setPasswordSee] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingVerifyModal, setIsLoadingVerifyModal] = useState(false);
  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null,
    },
  });

  const nameRef = useRef<any>(null);
  const lastnameRef = useRef<any>(null);
  const middleNameRef = useRef<any>(null);
  const secondLastnameRef = useRef<any>(null);
  const emailRef = useRef<any>(null);
  const phoneRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);

  const handleRefs = (ref: any, code: string) => {
    switch (code) {
      case 'name': {
        nameRef.current = ref;
        break;
      }
      case 'middle_name': {
        middleNameRef.current = ref;
      }
      case 'lastname': {
        lastnameRef.current = ref;
        break;
      }
      case 'second_lastname': {
        secondLastnameRef.current = ref;
        break;
      }
      case 'email': {
        emailRef.current = ref;
        break;
      }
    }
  };

  const handleFocusRef = (code: string) => {
    switch (code) {
      case 'name': {
        nameRef?.current?.focus();
        break;
      }
      case 'middle_name': {
        middleNameRef?.current?.focus();
        break;
      }
      case 'lastname': {
        lastnameRef?.current?.focus();
        break;
      }
      case 'second_lastname': {
        secondLastnameRef?.current?.focus();
        break;
      }
      case 'email': {
        emailRef?.current?.focus();
        break;
      }
    }
  };

  const getNextFieldCode = (index: number) => {
    const fields = sortInputFields({
      values: validationFields?.fields?.checkout,
    })?.filter(
      (field: any) =>
        !notValidationFields.includes(field.code) && showField(field.code),
    );
    return fields[index + 1]?.code;
  };

  const handleSignup = () => {
    handleSubmit(onSubmit)();
  };

  const onSubmit = (values: any) => {
    Keyboard.dismiss();

    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error);
      return;
    }

    if (
      !phoneInputData.phone.country_phone_code &&
      !phoneInputData.phone.cellphone &&
      validationFields?.fields?.checkout?.cellphone?.enabled &&
      validationFields?.fields?.checkout?.cellphone?.required
    ) {
      showToast(
        ToastType.Error,
        t(
          'VALIDATION_ERROR_MOBILE_PHONE_REQUIRED',
          'The field Mobile phone is required.',
        ),
      );
      return;
    }

    if (!useSignupByCellphone) {
      handleButtonSignupClick &&
        handleButtonSignupClick({
          ...values,
          ...phoneInputData.phone,
          level: 1,
        });

      if (
        !formState.loading &&
        formState.result.result &&
        !formState.result.error
      ) {
        handleSuccessSignup && handleSuccessSignup(formState.result.result);
      }
      return;
    }

    setFormValues(values);
    handleVerifyCodeClick(values);
  };

  const handleVerifyCodeClick = (values: any) => {
    const formData = values || formValues;

    handleSendVerifyCode &&
      handleSendVerifyCode({
        ...formData,
        ...phoneInputData.phone,
      });

    setIsLoadingVerifyModal(true);
  };

  // get object with rules for hook form inputs
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

  const handleChangeInputEmail = (value: string, onChange: any) => {
    onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
  };

  useEffect(() => {
    if (!formState.loading && formState.result?.error) {
      formState.result?.result &&
        showToast(ToastType.Error, formState.result?.result[0]);
      setIsLoadingVerifyModal(false);
    }
  }, [formState]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors);

      if (phoneInputData.error) {
        list.push({ message: phoneInputData.error });
      }

      if (
        !phoneInputData.error &&
        !phoneInputData.phone.country_phone_code &&
        !phoneInputData.phone.cellphone &&
        validationFields?.fields?.checkout?.cellphone?.enabled &&
        validationFields?.fields?.checkout?.cellphone?.required
      ) {
        list.push({
          message: t(
            'VALIDATION_ERROR_MOBILE_PHONE_REQUIRED',
            'The field Mobile phone is required.',
          ),
        });
      }

      let stringError = '';
      list.map((item: any, i: number) => {
        stringError +=
          i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });

      showToast(ToastType.Error, stringError);
      setIsLoadingVerifyModal(false);
    }
  }, [errors]);

  useEffect(() => {
    if (verifyPhoneState && !verifyPhoneState?.loading) {
      if (verifyPhoneState.result?.error) {
        const message =
          typeof verifyPhoneState?.result?.result === 'string'
            ? verifyPhoneState?.result?.result
            : verifyPhoneState?.result?.result[0];

        verifyPhoneState.result?.result && showToast(ToastType.Error, message);
        setIsLoadingVerifyModal(false);
        return;
      }

      const okResult = verifyPhoneState.result?.result === 'OK';
      if (okResult) {
        !isModalVisible && setIsModalVisible(true);
        setIsLoadingVerifyModal(false);
      }
    }
  }, [verifyPhoneState]);

  const styles = StyleSheet.create({
    header: {
      marginBottom: 30,
      justifyContent: 'space-between',
    },
    arrowLeft: {
      maxWidth: 40,
      height: 25,
      justifyContent: 'flex-end',
      marginBottom: 25,
    },
    title: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 26,
      color: theme.colors.textGray,
    },
    btn: {
      borderRadius: 7.6,
      height: 44,
    },
    btnText: {
      color: theme.colors.inputTextColor,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
    },
    btnFlag: {
      borderWidth: 1,
      borderRadius: 7.6,
      marginRight: 9,
      borderColor: theme.colors.inputSignup,
    },
    input: {
      color: theme.colors.inputTextColor,
      marginBottom: 20,
      borderWidth: 1,
      borderRadius: 7.6,
      borderColor: theme.colors.inputSignup,
      backgroundColor: theme.colors.transparent,
    },
  });

  return (
    <View>
      <View style={styles.header}>
        <OIconButton
          icon={theme.images.general.arrow_left}
          borderColor={theme.colors.clear}
          iconStyle={{ width: 20, height: 20 }}
          style={styles.arrowLeft}
          onClick={() => navigation?.canGoBack() && navigation.goBack()}
        />

        <OText style={styles.title}>{t('SIGNUP', 'Sign Up')}</OText>
      </View>

      <FormInput>
        {!(validationFields?.loading && validationFields?.fields?.checkout) ? (
          <>
            {sortInputFields({
              values: validationFields?.fields?.checkout,
            }).map(
              (field: any, i: number) =>
                !notValidationFields.includes(field.code) &&
                showField &&
                showField(field.code) && (
                  <Controller
                    key={field.id}
                    control={control}
                    render={({ onChange, value }: any) => (
                      <OInput
                        placeholder={t(field.name)}
                        style={styles.input}
                        icon={
                          field.code === 'email'
                            ? theme.images.logos.emailInputIcon
                            : theme.images.general.profile
                        }
                        value={value}
                        onChange={(val: any) =>
                          field.code !== 'email'
                            ? onChange(val)
                            : handleChangeInputEmail(val, onChange)
                        }
                        autoCapitalize={
                          field.code === 'email' ? 'none' : 'sentences'
                        }
                        autoCorrect={field.code === 'email' && false}
                        type={
                          field.code === 'email' ? 'email-address' : 'default'
                        }
                        autoCompleteType={
                          field.code === 'email' ? 'email' : 'off'
                        }
                        selectionColor={theme.colors.primary}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        forwardRef={(ref: any) => handleRefs(ref, field.code)}
                        onSubmitEditing={() =>
                          field.code === 'email'
                            ? phoneRef.current.focus()
                            : handleFocusRef(getNextFieldCode(i))
                        }
                      />
                    )}
                    name={field.code}
                    rules={getInputRules(field)}
                    defaultValue=""
                  />
                ),
            )}

            {!!showInputPhoneNumber && (
              <View style={{ marginBottom: 25 }}>
                <PhoneInputNumber
                  data={phoneInputData}
                  handleData={(val: any) => setPhoneInputData(val)}
                  forwardRef={phoneRef}
                  flagProps={styles.btnFlag}
                  onSubmitEditing={() => null}
                  textInputProps={{
                    returnKeyType: 'next',
                    onSubmitEditing: () => passwordRef.current.focus(),
                  }}
                />
              </View>
            )}

            <Controller
              control={control}
              render={({ onChange, value }: any) => (
                <OInput
                  isSecured={!passwordSee ? true : false}
                  placeholder={t('PASSWORD', 'Password')}
                  style={styles.input}
                  icon={theme.images.logos.passwordInputIcon}
                  iconCustomRight={
                    !passwordSee ? (
                      <MaterialCommunityIcons
                        name="eye-outline"
                        size={24}
                        color={theme.colors.inputSignup}
                        onPress={() => setPasswordSee(!passwordSee)}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="eye-off-outline"
                        size={24}
                        color={theme.colors.inputSignup}
                        onPress={() => setPasswordSee(!passwordSee)}
                      />
                    )
                  }
                  selectionColor={theme.colors.primary}
                  value={value}
                  onChange={(val: any) => onChange(val)}
                  returnKeyType="done"
                  blurOnSubmit
                  forwardRef={passwordRef}
                />
              )}
              name="password"
              rules={{
                required: isRequiredField('password')
                  ? t(
                      'VALIDATION_ERROR_PASSWORD_REQUIRED',
                      'The field Password is required',
                    ).replace('_attribute_', t('PASSWORD', 'password'))
                  : null,
                minLength: {
                  value: 8,
                  message: t(
                    'VALIDATION_ERROR_PASSWORD_MIN_STRING',
                    'The Password must be at least 8 characters.',
                  )
                    .replace('_attribute_', t('PASSWORD', 'Password'))
                    .replace('_min_', 8),
                },
              }}
              defaultValue=""
            />
          </>
        ) : (
          <Spinner visible />
        )}

        {useSignupByCellphone ? (
          <OButton
            onClick={handleSubmit(onSubmit)}
            text={t('GET_VERIFY_CODE', 'Get Verify Code')}
            borderColor={theme.colors.primary}
            textStyle={styles.btnText}
            style={styles.btn}
            imgRightSrc={null}
            isLoading={isLoadingVerifyModal}
            indicatorColor={theme.colors.white}
          />
        ) : (
          <OButton
            onClick={handleSignup}
            text={t('SIGNUP', 'Sign Up')}
            bgColor={theme.colors.primary}
            borderColor={theme.colors.primary}
            textStyle={styles.btnText}
            style={styles.btn}
            imgRightSrc={null}
            isDisabled={formState.loading || validationFields.loading}
          />
        )}
      </FormInput>

      <OModal open={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <VerifyPhone
          phone={phoneInputData.phone}
          formValues={formValues}
          verifyPhoneState={verifyPhoneState}
          checkPhoneCodeState={checkPhoneCodeState}
          handleCheckPhoneCode={handleCheckPhoneCode}
          setCheckPhoneCodeState={setCheckPhoneCodeState}
          handleVerifyCodeClick={onSubmit}
        />
      </OModal>

      <Spinner visible={formState.loading} />
    </View>
  );
};

export const SignupForm = (props: any) => {
  const signupProps = {
    ...props,
    UIComponent: SignupFormUI,
  };
  return <SignUpController {...signupProps} />;
};
