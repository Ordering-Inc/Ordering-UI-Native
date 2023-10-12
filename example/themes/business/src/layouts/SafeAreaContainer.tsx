import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { useNetInfo } from '@react-native-community/netinfo';

export const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;

export const SafeAreaContainerLayout = (props: any) => {
  const theme = useTheme();
  const netInfo = useNetInfo()

  const [statusColor, setStatusColor] = useState<string | null>(null)
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

  useEffect(() => {
    if (netInfo.isConnected === false) {
      setStatusColor(theme.colors.danger500)
    }

    if (netInfo.isConnected && statusColor) {
      setStatusColor(theme.colors.success500)
      setTimeout(() => {
        setStatusColor(null)
      }, 2000);
    }
  }, [netInfo.isConnected])

  return (
    <SafeAreaContainer>
      <View
        style={{
          paddingHorizontal: 30,
          paddingTop: 30,
          paddingBottom: 0,
          flex: 1,
        }}>
        <StatusBar
          barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
          {...statusColor && ({ backgroundColor: statusColor })}
        />
        {props.children}
      </View>
    </SafeAreaContainer>
  );
};
