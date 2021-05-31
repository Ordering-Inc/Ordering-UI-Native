import React, { useEffect, useState, useRef } from 'react'
import { LoginParams } from "../../types"
import { LoginForm as LoginFormController, useLanguage } from "ordering-components/native";
import { OText } from '../shared';
import { colors } from '../../theme.json';

import {
  Container,
} from './styles';

const LoginFormUI = (props: LoginParams) => {
  const [, t] = useLanguage();

  return (
    <Container>
      <OText
        size={18}
        color={
          colors.primary
        }>
        Texto de prueba
      </OText>
    </Container>
  )
}

export const LoginForm = (props: any) => {
  const loginProps = {
    ...props,
    UIComponent: LoginFormUI,
  };
  return <LoginFormController {...loginProps} />;
};
