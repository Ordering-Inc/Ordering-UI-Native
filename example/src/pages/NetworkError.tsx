import React from 'react';
import {
  NotFoundSource,
} from '../components/NotFoundSource';
import { useTheme } from 'styled-components/native';
import { useLanguage } from 'ordering-components/native';
import { SafeAreaContainer } from '../layouts/SafeAreaContainer'

const NetworkError = () => {
  const theme = useTheme();
  const [, t] = useLanguage();

  return (
    <SafeAreaContainer style={{ backgroundColor: theme.colors.white }}>
      <NotFoundSource
        content={t('NETWORK_ERROR', 'Network Error')}
        image={theme.images.general.notFound}
        conditioned={false}
      />
    </SafeAreaContainer>
  );
};

export default NetworkError;
