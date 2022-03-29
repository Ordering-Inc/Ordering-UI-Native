import React, { useState } from 'react';
import { Modal } from 'react-native';
import { useLanguage, LogoutAction, useApi, useSession, useBusiness, useOrder } from 'ordering-components/native';
import { useForm, Controller } from 'react-hook-form';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from 'styled-components/native';

import NavBar from '../NavBar';
import { OSBody, OSContainer, OSContent } from './styles';
import { OButton, OInput, OText } from '../shared';
import { useDeviceOrientation, PORTRAIT } from '../../../../../src/hooks/DeviceOrientation';
import { _clearStoreData, _retrieveStoreData } from '../../../../../src/providers/StoreUtil'

const LogoutPopupUI = (props: Props) => {
  const {
    open,
    onClose,
    handleLogoutClick
  } = props;

  const theme = useTheme();
  const [, { setStateValues }] = useOrder();
  const [ordering] = useApi();
  const [{ token }] = useSession();
  const [, t] = useLanguage();
  const [, { setBusiness }] = useBusiness();
  const [orientationState] = useDeviceOrientation();
  const { control, handleSubmit, errors } = useForm();
  const [passwordSee, setPasswordSee] = useState(false);
  const [logoutState, setLogoutState] = useState<any>({ loading: false, error: false, result: [] })

  const fetchPassword = async (body: any) => {
    try {
      setLogoutState({ ...logoutState, loading: true })
      const response = await fetch(`${ordering.root}/users/check_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      })
      const { error, result } = await response.json()
      setLogoutState({
        ...logoutState,
        loading: false,
        error,
        result
      })
      return { error, result }
    } catch (e: any) {
      setLogoutState({
        ...logoutState,
        loading: false,
        error: true,
        result: [e?.message]
      })
    }
  }

  const onSubmit = async (values: any) => {
    const result = await fetchPassword(values)
    if (result?.result === 'OK') {
      const res: any = await handleLogoutClick();
      if (res) {
        _clearStoreData({ excludedKeys: ['isTutorial'] })
        setBusiness({})
        setStateValues({
          options: {
            moment: null
          },
          carts: {},
        })
      }
      onClose();
    }
  }

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={open}
      onRequestClose={onClose}
      style={{
        width: 200,
        minHeight: 300,
      }}
    >
      <OSContainer>
        <OSContent isportrait={orientationState?.orientation === PORTRAIT}>
          <NavBar
            title={t('SIGN_OUT', 'Sign out')}
            titleStyle={{ paddingLeft: 10 }}
            style={{ backgroundColor: 'transparent', paddingBottom: 1, }}
            rightComponent={<OButton
              text={t('CANCEL', 'Cancel')}
              bgColor="transparent"
              borderColor="transparent"
              style={{ paddingEnd: 20 }}
              textStyle={{ color: theme.colors.primary, marginEnd: 0 }}
              onClick={onClose}
            />}
          />

          <OSBody>
            <OText
              size={orientationState?.dimensions?.width * 0.032}
              mBottom={20}
            >
              {t('ONLY_MANAGER_LOGOUT', 'Only the manager has the password to sign out this App.')}
            </OText>
              <Controller
                control={control}
                render={({ onChange, value }: any) => (
                  <OInput
                    isSecured={!passwordSee ? true : false}
                    placeholder={t('PASSWORD', 'Password')}
                    style={{
                      marginBottom: 25,
                      borderWidth: 1,
                      borderColor: theme.colors.disabled,
                      minHeight: 50
                    }}
                    iconCustomRight={
                      !passwordSee ?
                        <MaterialCommunityIcons name='eye-outline' size={24} onPress={() => setPasswordSee(!passwordSee)} /> :
                        <MaterialCommunityIcons name='eye-off-outline' size={24} onPress={() => setPasswordSee(!passwordSee)} />
                    }
                    value={value}
                    onChange={(val: any) => onChange(val)}
                    autoCapitalize='none'
                    returnKeyType='done'
                  />
                )}
                name="password"
                rules={{ required: t('VALIDATION_ERROR_PASSWORD_REQUIRED', 'The field Password is required').replace('_attribute_', t('PASSWORD', 'Password')) }}
                defaultValue=""
              />
              <OButton
                text={t('SIGN_OUT', 'Sign out')}
                onClick={handleSubmit(onSubmit)}
                isLoading={logoutState.loading}
              />
              {errors?.password?.message && (
                <OText
                  color={theme.colors.toastError}
                  mBottom={30}
                  style={{ textAlign: 'center', minHeight: 40, marginTop: 10 }}
                >
                  {errors?.password?.message}
                </OText>
              )}

              {logoutState.error &&  logoutState.result && (
                <OText
                  color={theme.colors.toastError}
                  mBottom={30}
                  style={{ textAlign: 'center', minHeight: 40, marginTop: 10 }}
                >
                  {logoutState.result[0]}
                </OText>
              )}
          </OSBody>
        </OSContent>
      </OSContainer>
    </Modal>
  );
}

interface Props {
  open: boolean;
  formState: { loading: boolean, result: { error: boolean, result: any } },
  handleLogoutClick: () => void;
  onClose: () => void;
  onLogoutDone?: () => void;
}

export const LogoutPopup = (props: any) => {
  const logoutProps = {
    ...props,
    isNative: true,
    UIComponent: LogoutPopupUI
  }
  return (
    <LogoutAction {...logoutProps} />
  )
}
