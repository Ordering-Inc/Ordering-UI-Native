import React from 'react';
import {
  UserFormDetails as UserProfileController,
  useSession,
} from 'ordering-components/native';
import {launchImageLibrary} from 'react-native-image-picker';

import Spinner from 'react-native-loading-spinner-overlay';
import {StyleSheet} from 'react-native';
import {IMAGES} from '../../config/constants';
import {colors} from '../../theme';
import ToggleSwitch from 'toggle-react-native';
import {ToastType, useToast} from '../../providers/ToastProvider';
import ApiProvider from '../../providers/ApiProvider';
import {ProfileParams} from '../../types'
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

const ProfileUI = (props: ProfileParams) => {
  const {
    isEdit,
    formState,
    toggleIsEdit,
    cleanFormState,
    setFormState,
    handleChangeInput,
  } = props;

  const [{user}] = useSession();
  const ordering = ApiProvider();
  const {showToast} = useToast();

  const [canGetOrders, changeGetOrders] = React.useState(true);
  const [canPush, changeCanPush] = React.useState(true);

  const handleImagePicker = () => {
    launchImageLibrary(
      {mediaType: 'photo', includeBase64: true},
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
          showToast(ToastType.Error, response.errorMessage);
        } else {
          handleUpdateUser(response.uri);
        }
      },
    );
  };

  const handleUpdateUser = async (image?: any) => {
    let response;
    try {
      setFormState({...formState, loading: true});
      if (image) {
        response = await ordering
          .setAccessToken(user?.session?.access_token)
          .users(user?.id)
          .save({photo: image});
      } else {
        response = await ordering
          .setAccessToken(user?.session?.access_token)
          .users(user?.id)
          .save(formState.changes);
      }
      setFormState({
        ...formState,
        changes: response.content.error ? formState.changes : {},
        result: response.content,
        loading: false,
      });
      if (response.content.error) {
        showToast(ToastType.Error, response.content.result);
      } else {
        showToast(ToastType.Success, 'Update successfully');
        toggleIsEdit();
      }
    } catch (error) {
      showToast(ToastType.Error, error.message);
    }
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
    cleanFormState({changes: {}});
    toggleIsEdit();
  };

  return (
    <>
      <CenterView>
        <OIcon
          src={formState?.result?.result?.photo || user.photo || IMAGES.avatar}
          width={100}
          height={100}
          style={{borderRadius: 12}}
        />
        <OIconButton
          icon={IMAGES.camera}
          borderColor={colors.clear}
          iconStyle={{width: 30, height: 30}}
          style={{maxWidth: 40}}
          onClick={() => handleImagePicker()}
        />
      </CenterView>
      <Spinner visible={formState?.loading} />
      {!isEdit ? (
        <UserData>
          <Names>
            <OText>{formState?.result?.result?.name || user.name}</OText>
            <OText>
              {formState?.result?.result?.lastname || user.lastname}
            </OText>
          </Names>
          <OText>{formState?.result?.result?.email || user.email}</OText>
          {(formState?.result?.result?.cellphone || user.cellphone) && (
            <OText>
              {formState?.result?.result?.cellphone || user.cellphone}
            </OText>
          )}
        </UserData>
      ) : (
        <>
          <OInput
            name="name"
            placeholder={'Full Name'}
            borderColor={colors.whiteGray}
            style={styles.inputbox}
            onChange={handleChangeInput}
            value={formState?.result?.result?.name || user.name}
          />
          <OInput
            name="email"
            placeholder={'Email'}
            borderColor={colors.whiteGray}
            style={styles.inputbox}
            onChange={handleChangeInput}
            value={formState?.result?.result?.email || user.email}
          />
          <OInput
            name="cellphone"
            placeholder={'Mobile number'}
            borderColor={colors.whiteGray}
            style={styles.inputbox}
            onChange={handleChangeInput}
            value={formState?.result?.result?.cellphone || user.cellphone}
          />
          <OInput
            name="password"
            placeholder={'Password'}
            borderColor={colors.whiteGray}
            style={styles.inputbox}
            onChange={handleChangeInput}
          />
        </>
      )}
      <EditButton>
        {!isEdit ? (
          <OKeyButton
            title="Edit"
            style={{...styles.editButton, flex: 0}}
            onClick={toggleIsEdit}
          />
        ) : (
          <>
            <OKeyButton
              title="Cancel"
              style={styles.editButton}
              onClick={() => handleCancelEdit()}
            />
            {((formState &&
              Object.keys(formState?.changes).length > 0 &&
              isEdit) ||
              formState?.loading) && (
              <OKeyButton
                title="Update"
                onClick={() => handleUpdateUser()}
                style={{...styles.editButton, backgroundColor: colors.primary}}
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

      <OText size={20} style={{marginVertical: 20}}>
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
        style={{marginBottom: 120, ...styles.dropdown}}
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
