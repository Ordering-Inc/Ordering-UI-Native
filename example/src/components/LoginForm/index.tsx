import React, {useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import Spinner from 'react-native-loading-spinner-overlay';
import {LoginForm as LoginFormController} from 'ordering-components/native';

import {Wrapper} from './styles';

import {IMAGES, STORAGE_KEY} from '../../config/constants';
import ApiProvider from '../../providers/ApiProvider';
import {ToastType, useToast} from '../../providers/ToastProvider';
import {_setStoreData} from '../../providers/StoreUtil';
import {colors} from '../../theme';
import {OText, OButton, OInput} from '../shared';
import {ViewInterface} from '../../types';

const LoginFormUI = (props: ViewInterface) => {
  // const {formState} = props;

  const {register, handleSubmit, setValue, errors} = useForm()

  const ordering = ApiProvider();
  const {showToast} = useToast();
  // const auth = {
  //   email: '',
  //   password: '',
  // };

  const onSubmit = (data: any) => {
    console.log(data);
    showToast(ToastType.Info, `Form data: email: ${data.email}, password: ${data.password}`);
    return;
  }

  useEffect(() => {
    register('email')
    register('password')
  }, [register])

  // const [email, onChangEmail] = useState(auth.email);
  // const [password, onChangPassword] = useState(auth.password);
  // const [is_loading, setLoading] = useState(false);

  // useEffect(() => {
  //   onChangEmail(email.toLowerCase().trim());
  // }, [email]);

  // const onLogin = () => {
  //   if (email.length === 0 || password.length === 0) {
  //     showToast(ToastType.Info, 'Email and Password fields are required.');
  //     return;
  //   }
  //   setLoading(true);
  //   ordering
  //     .users()
  //     .auth({email: email, password: password})
  //     .then((res: any) => {
  //       let resp = res.response.data;
  //       if (!resp.error) {
  //         setLoading(false);
  //         if (resp.result && resp.result.available && resp.result.level === 4) {
  //           _setStoreData(STORAGE_KEY.USER, resp.result);
  //           props.navigation.navigate('Home');
  //         } else {
  //           showToast(ToastType.Error, "You don't have permission to use app.");
  //         }
  //       } else {
  //         setLoading(false);
  //         var err = '';
  //         resp.result.map((e: string, index: number) => {
  //           err += e + (index < resp.result.length - 1 ? '\n' : '');
  //         });
  //         showToast(ToastType.Error, err);
  //       }
  //     })
  //     .catch(() => {
  //       setLoading(false);
  //     });
  // };

  let title, sub_title, reg_button;
  if (props.title) {
    title = (
      <OText size={24} color="white">
        {props.title}
      </OText>
    );
  }
  if (props.subTitle) {
    sub_title = (
      <OText size={16} color="white" mBottom={18}>
        {props.subTitle}
      </OText>
    );
  }
  if (props.onRegister) {
    reg_button = (
      <OButton
        onClick={props.onRegister}
        text={props.registerButtonText}
        bgColor={props.registerButtonBackground}
        borderColor={props.registerButtonBorderColor}
        textStyle={{color: 'white'}}
        style={{marginBottom: 15}}
      />
    );
  }
  return (
    <Wrapper
      backgroundColor={props.backgroundColor}
      borderRadius={props.borderRadius || '0px'}
      style={props.wrapperStyle}
      border={props.border}>
      {/* <Spinner visible={is_loading} /> */}
      {title}
      {sub_title}
      <OInput
        placeholder={'Email'}
        style={{marginBottom: 10}}
        icon={IMAGES.email}
        // value={email}
        onChange={(e: any) => {
          setValue('email', e)
        }}
      />
      <OInput
        isSecured={true}
        placeholder={'Password'}
        style={{marginBottom: 25}}
        icon={IMAGES.lock}
        // value={password}
        onChange={(p: any) => {
          setValue('password', p)
        }}
      />
      <OButton
        onClick={handleSubmit(onSubmit)}
        text={props.loginButtonText}
        bgColor={props.loginButtonBackground}
        borderColor={props.loginButtonBackground}
        textStyle={{color: 'white'}}
        style={{marginBottom: 14}}
      />
      {/* {reg_button} */}
      <OButton
        onClick={props.onForgot}
        text={props.forgotButtonText}
        bgColor={colors.clear}
        borderColor={colors.clear}
        textStyle={{color: 'white'}}
        imgRightSrc={null}
      />
    </Wrapper>
  );
};

export const LoginForm = (props: any) => {
  const loginProps = {
    ...props,
    UIComponent: LoginFormUI,
  };
  return <LoginFormController {...loginProps} />;
};
