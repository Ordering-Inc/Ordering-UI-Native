import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useDeviceOrientation } from '../../../../../src/hooks/DeviceOrientation';
import {
  BusinessController as BusinessSingleCard,
  useUtils,
} from 'ordering-components/native';
import FastImage from 'react-native-fast-image'

import { Card, BusinessLogo } from './styles';

import { OText } from '../shared';

export const BusinessControllerUI = (props: any) => {
  const { business, handleClick, isLoading } = props;
  const [{ optimizeImage }] = useUtils();
  const theme = useTheme()

  const [orientationState] = useDeviceOrientation();

  const WIDTH_SCREEN = orientationState?.dimensions?.width

  const styles = StyleSheet.create({
    businessName: {
      width: '100%',
      alignItems: 'center',
      textAlign: 'center',
      marginTop: 10
    },
    logoStyle: {
      width: 120,
      height: 120,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }
  });

  const handleBusinessClick = (selectedBusiness: any) => {
    if (isLoading) return
    handleClick && handleClick(selectedBusiness)
  }

  return (
    <Card
      activeOpacity={1}
      onPress={() => handleBusinessClick(business)}
    >
      {business?.logo ? (
        <FastImage
          style={styles.logoStyle}
          source={{
            uri: business?.logo,
            priority: FastImage.priority.high,
            cache:FastImage.cacheControl.web
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      ) : (
        <BusinessLogo
          source={theme.images.dummies.businessLogo}
          resizeMode='contain'
        />
      )}
      <OText
        size={WIDTH_SCREEN * 0.012}
        numberOfLines={2}
        ellipsizeMode='tail'
        style={styles.businessName}
      >
        {business?.name}
      </OText>
    </Card>
  );
};

export const BusinessController = (props: any) => {
  const BusinessControllerProps = {
    ...props,
    UIComponent: BusinessControllerUI,
  };

  return <BusinessSingleCard {...BusinessControllerProps} />;
};
