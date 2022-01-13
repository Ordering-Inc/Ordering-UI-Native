import React, { useState } from 'react';
import { Platform, Dimensions, StatusBar } from 'react-native';
import styled, { css } from 'styled-components/native';

const ContainerStyled = styled.ScrollView`
  flex: 1;
  ${(props: any) =>
    !props.nopadding &&
    css`
      padding: ${Platform.OS === 'ios' && props.orientation === 'Portrait'
        ? '0px 20px 20px'
        : '20px'};
    `}
  background-color:  ${(props: any) => props.theme.colors.backgroundPage};
`;

const SafeAreaStyled = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;

export const Container = (props: any) => {
  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width < Dimensions.get('window').height
      ? 'Portrait'
      : 'Landscape',
  );

  Dimensions.addEventListener('change', ({ window: { width, height } }) => {
    if (width < height) {
      setOrientation('Portrait');
    } else {
      setOrientation('Landscape');
    }
  });

  return (
    <SafeAreaStyled style={props.style}>
      <StatusBar
        backgroundColor={props?.style?.backgroundColor || 'transparent'}
        barStyle={props?.barStyle || 'dark-content'}
        translucent={props?.translucent || false}
        showHideTransition="fade"
        animated
      />
      <ContainerStyled
        contentContainerStyle={props.style}
        keyboardShouldPersistTaps="handled"
        orientation={orientation}
        ref={props?.forwardRef}
      >
        {props.children}
      </ContainerStyled>
    </SafeAreaStyled>
  );
};
