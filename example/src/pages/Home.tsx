import React from 'react';
import { Home as HomePage } from '../components/Home';
import { useLanguage } from 'ordering-components/native';
import { Container } from '../layouts/Container';
import { SafeAreaContainer } from '../layouts/SafeAreaContainer'

export const Home = ({navigation}: any) => {
  const [, t] = useLanguage();
  const homeProps = {
    navigation,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      navigation.navigate(page, params);
    },
    sloganTitle: t('TITLE_HOME', 'Welcome!'),
    sloganSubtitle: t('SUBTITLE_HOME', "Let's start to order food now")
  }

  return (
    <SafeAreaContainer>
      <Container nopadding>
        <HomePage {...homeProps} />
      </Container>
    </SafeAreaContainer>
  );
};

export default Home;
