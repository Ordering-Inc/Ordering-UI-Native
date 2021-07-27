import React from 'react';
import {
  BusinessController as BusinessSingleCard,
  useUtils,
  // useOrder,
  // useLanguage,
} from 'ordering-components/native';
import { OIcon, OText } from '../shared';
import { StyleSheet, View } from 'react-native';
import { BusinessControllerParams } from '../../types';
import { Card, Information, Logo } from './styles';
import ToggleSwitch from 'toggle-switch-react-native';
import { useTheme } from 'styled-components/native';

export const BusinessControllerUI = (props: BusinessControllerParams) => {
  const {
    business,
    businessState,
    // handleClick,
    // isBusinessOpen,
    // businessWillCloseSoonMinutes,
    updateBusiness,
  } = props;

  const theme = useTheme();
  const [{ optimizeImage }] = useUtils();
  // const [, t] = useLanguage();

  const handleSwitch = () => {
    updateBusiness &&
      updateBusiness(business.id, { enabled: !business.enabled });
  };

  const { loading } = businessState;

  const styles = StyleSheet.create({
    logo: {
      borderRadius: 7.6,
      width: 73,
      height: 73,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    title: {
      fontWeight: 'bold',
      fontSize: 18,
      color: theme.colors.textGray,
    },
    address: {
      fontSize: 14,
      color: theme.colors.unselectText,
    },
  });

  return (
    <>
      {business && (
        <Card key={business.id}>
          {!!business?.logo && (
            <Logo>
              <OIcon
                url={optimizeImage(business?.logo, 'h_300,c_limit')}
                style={styles.logo}
              />
            </Logo>
          )}

          <Information>
            <View style={styles.header}>
              <OText style={styles.title} numberOfLines={1}>
                {business?.name}
              </OText>
              <ToggleSwitch
                isOn={business?.enabled}
                onColor={theme.colors.primary}
                offColor={theme.colors.offColor}
                size="small"
                onToggle={handleSwitch}
                disabled={loading}
                animationSpeed={200}
              />
            </View>

            <OText style={styles.address} numberOfLines={1}>
              {business?.address}
            </OText>

            <OText style={styles.address} numberOfLines={1}>
              {business?.zipcode ? business.zipcode : "doesn't have zipcode"}
            </OText>
          </Information>
        </Card>
      )}
    </>
  );
};

export const BusinessController = (props: BusinessControllerParams) => {
  const BusinessControllerProps = {
    ...props,
    UIComponent: BusinessControllerUI,
  };

  return <BusinessSingleCard {...BusinessControllerProps} />;
};
