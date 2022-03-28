import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useDeviceOrientation } from '../../../../../src/hooks/DeviceOrientation';
import {
  BusinessController as BusinessSingleCard,
  useUtils,
} from 'ordering-components/native';

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
      <BusinessLogo
        source={business?.logo ? {
          uri: optimizeImage(business?.logo, 'h_120,c_limit'),
        } : theme.images.dummies.businessLogo}
        resizeMode='contain'
      />
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
