import React from 'react';
import styled, { useTheme } from 'styled-components/native';

const LogoSplash = styled.ImageBackground`
  width: 100%;
  height: 100%;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`

const Splash = () => {
  const theme = useTheme();

  return (
    <LogoSplash
      source={theme.images.general.loadingSplash}
      resizeMode='contain'
    />
  )
}

export default Splash;
