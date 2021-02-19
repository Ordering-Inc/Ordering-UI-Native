import React, { useEffect, useState } from 'react';
import {
  UserFormDetails as UserProfileController,
  useSession,
  useUtils,
  useLanguage,
} from 'ordering-components/native';
import { useForm, Controller } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { StyleSheet } from 'react-native';
import { IMAGES } from '../../config/constants';
import { colors } from '../../theme';
import ToggleSwitch from 'toggle-react-native';
import { ToastType, useToast } from '../../providers/ToastProvider';
import { ProfileParams } from '../../types';
import { flatArray } from '../../utils';
import {
  ODropDown,
  OIcon,
  OIconButton,
  OInput,
  OText,
  OKeyButton,
} from '../../components/shared';
import {
  CenterView,
  DetailView,
  PushSetting,
  UserData,
  Names,
  EditButton,
} from './styles';

const notValidationFields = [
  'coupon',
  'driver_tip',
  'mobile_phone',
  'address',
  'address_notes',
];

const ProfileUI = (props: ProfileParams) => {
  const {
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
  const { control, handleSubmit, errors } = useForm();
  const [{ optimizeImage }] = useUtils();

  const [canGetOrders, changeGetOrders] = useState(true);
  const [canPush, changeCanPush] = useState(true);
  const [validationFieldsSorted, setValidationFieldsSorted] = useState(
    [],
  );

  const onSubmit = (values: any) => handleButtonUpdateClick(values);

  const sortValidationFields = () => {
    const fields = [
      'name',
      'middle_name',
      'lastname',
      'second_lastname',
      'email',
    ];
    const fieldsSorted = [];
    const validationsFieldsArray = Object.values(
      validationFields.fields?.checkout,
    );

    fields.forEach((f) => {
      validationsFieldsArray.forEach((field: any) => {
        if (f === field.code) {
          fieldsSorted.push(field);
        }
      });
    });

    fieldsSorted.push(
      validationsFieldsArray.filter(
        (field: any) => !fields.includes(field.code),
      ),
    );
    setValidationFieldsSorted(flatArray(fieldsSorted));
  };

  useEffect(() => {
    if (!formState.loading && formState.result?.error) {
      showToast(ToastType.Error, formState.result?.result[0]);
    }
  }, [formState]);

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
    if (validationFields?.fields?.checkout) {
      sortValidationFields();
    }
  }, [validationFields?.fields?.checkout]);

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        showToast(ToastType.Error, response.errorMessage);
      } else {
        handleButtonUpdateClick({}, optimizeImage(response.uri));
      }
    });
  };

  const toggleGetOrder = () => {
    changeGetOrders((status) => !status);
  };
  const togglePush = () => {
    changeCanPush((status) => !status);
  };
  const onChangeTimeFormat = (idx: number) => {
    alert(idx);
  };

  const handleCancelEdit = () => {
    cleanFormState({ changes: {} });
    toggleIsEdit();
  };

  return (
    <>
      <CenterView>
        <OIcon
          url={user.photo}
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
            <OText space>{user.name}</OText>
            <OText>{user.lastname}</OText>
          </Names>
          <OText>{user.email}</OText>
          {user.cellphone && <OText>{user.cellphone}</OText>}
        </UserData>
      ) : (
          <>
            {validationFieldsSorted.map(
              (field: any) =>
                !notValidationFields.includes(field.code) &&
                showField &&
                showField(field.code) && (
                  <Controller
                    key={field.id}
                    control={control}
                    render={({ onChange, value }) => (
                      <OInput
                        name={field.code}
                        placeholder={t(field.code.toUpperCase(), field?.name)}
                        borderColor={colors.whiteGray}
                        style={styles.inputbox}
                        onChange={(val: any) => {
                          onChange(val);
                          handleChangeInput(val);
                        }}
                        value={value}
                      />
                    )}
                    name={field.code}
                    rules={{
                      required: isRequiredField(field.code)
                        ? t(
                          `VALIDATION_ERROR_${field.code.toUpperCase()}_REQUIRED`,
                          `${field?.name} is required`,
                        ).replace('_attribute_', t(field?.name, field.code))
                        : null,
                      pattern: {
                        value:
                          field.code === 'email'
                            ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                            : null,
                        message:
                          field.code === 'email'
                            ? t(
                              'INVALID_ERROR_EMAIL',
                              'Invalid email address',
                            ).replace('_attribute_', t('EMAIL', 'Email'))
                            : null,
                      },
                    }}
                    defaultValue={
                      formState?.result?.result
                        ? formState?.result?.result[field.code]
                        : formState?.changes[field.code] ??
                        (user && user[field.code]) ??
                        ''
                    }
                  />
                ),
            )}
            <Controller
              control={control}
              render={({ onChange, value }) => (
                <OInput
                  isSecured={true}
                  placeholder={'Password'}
                  style={{ marginBottom: 25 }}
                  icon={IMAGES.lock}
                  value={value}
                  onChange={(val: any) => onChange(val)}
                />
              )}
              name="password"
              rules={{ required: t('VALIDATION_ERROR_PASSWORD_REQUIRED', 'The field Password is required').replace('_attribute_', t('PASSWORD', 'Password')) }}
              defaultValue=""
            />
          </>
        )}
      <EditButton>
        {!isEdit ? (
          <OKeyButton
            title="Edit"
            style={{ ...styles.editButton, flex: 0 }}
            onClick={toggleIsEdit}
          />
        ) : (
            <>
              <OKeyButton
                title="Cancel"
                style={styles.editButton}
                onClick={handleCancelEdit}
              />
              {((formState &&
                Object.keys(formState?.changes).length > 0 &&
                isEdit) ||
                formState?.loading) && (
                  <OKeyButton
                    title="Update"
                    onClick={handleSubmit(onSubmit)}
                    style={{ ...styles.editButton, backgroundColor: colors.primary }}
                  />
                )}
            </>
          )}
      </EditButton>

      <DetailView>
        <OText>{'On Shift: Available to receive orders'}</OText>
        <ToggleSwitch
          size={'small'}
          onColor={colors.success}
          isOn={canGetOrders}
          onToggle={toggleGetOrder}
        />
      </DetailView>

      <OText size={20} style={{ marginVertical: 20 }}>
        {'Settings'}
      </OText>

      <PushSetting>
        <OText color={'grey'}>{'Push Notifications'}</OText>
        <ToggleSwitch
          onColor={colors.success}
          isOn={canPush}
          onToggle={togglePush}
        />
      </PushSetting>
      <ODropDown
        items={[]}
        placeholder={'Select your language'}
        style={styles.dropdown}
      />
      <ODropDown
        items={[]}
        placeholder={'Currency Position'}
        style={styles.dropdown}
      />
      <ODropDown
        items={['12H', '24H']}
        placeholder={'Time Format'}
        onSelect={() => onChangeTimeFormat}
        style={{ marginBottom: 120, ...styles.dropdown }}
      />
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
  },
  editButton: {
    borderRadius: 25,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    borderWidth: 2,
    color: colors.primary,
    width: 100,
    height: 50,
    marginVertical: 8,
    marginHorizontal: 8,
    flex: 1,
  },
});

export const UserProfileForm = (props: any) => {
  const profileProps = {
    ...props,
    UIComponent: ProfileUI,
  };
  return <UserProfileController {...profileProps} />;
};
