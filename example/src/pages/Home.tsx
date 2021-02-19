import React from 'react';
import {Home as HomePage} from '../components/Home';
import {useLanguage} from 'ordering-components/native';

export const Home = ({navigation}: any) => {
  const [, t] = useLanguage();

  const login = () => {
    navigation.navigate('Login');
  };

  const signup = () => {
    navigation.navigate('Signup');
  };

  return (
    <HomePage
      redirectLogin={login}
      redirectSignup={signup}
      sloganTitle={t('TITLE_HOME', 'Welcome!')}
      sloganSubtitle={t('SUBTITLE_HOME', "Let's start to order food now")}
    />
  );
};

export default Home;
