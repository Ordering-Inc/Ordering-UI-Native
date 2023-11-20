import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image'
import ToggleSwitch from 'toggle-switch-react-native';
import { useTheme } from 'styled-components/native';
import {
  BusinessController as BusinessSingleCard,
  useUtils,
  useLanguage,
  ToastType,
  useToast,
} from 'ordering-components/native';
import { Card, Information, Logo } from './styles';
import { OIcon, OText } from '../shared';
import { BusinessControllerParams } from '../../types';

export const BusinessControllerUI = (props: BusinessControllerParams) => {
  const { businessState, updateBusiness, isUpdateStore, setIsUpdateStore, navigation } =
    props;

  const { loading, business, error } = businessState;

  const theme = useTheme();
  const [{ optimizeImage }] = useUtils();
  const [, t] = useLanguage();
  const [, { showToast }] = useToast();

  const [updatingBusiness, setUpdatingBusiness] = useState(false);

  const handleSwitch = () => {
    setUpdatingBusiness(true);
    setIsUpdateStore(true);

    updateBusiness &&
      updateBusiness(business?.id, { enabled: !business?.enabled });
  };

  useEffect(() => {
    if (updatingBusiness && !error) {
      showToast(
        ToastType.Info,
        business?.enabled
          ? t('ENABLED_BUSINESS', 'Enabled business')
          : t('DISABLED_BUSINESS', 'Disabled business'),
      );
    }

    if (error) {
      showToast(
        ToastType.Error,
        t('ERROR_UPDATING_BUSINESS', 'Error updating business'),
      );
    }

    setIsUpdateStore(false);
    setUpdatingBusiness(false);
  }, [business]);

  const styles = StyleSheet.create({
    icon: {
      borderRadius: 7.6,
      width: 70,
      height: 70,
    },
    logo: {
      padding: 2,
      borderRadius: 18,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: business?.logo ? 1.5 : 0,
      },
      shadowOpacity: 0.21,
      shadowRadius: 3,
      elevation: business?.logo ? 7 : 0,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    title: {
      fontWeight: '600',
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
        <Card key={business?.id}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <TouchableOpacity
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
              onPress={() => navigation && business?.slug && navigation.navigate('BusinessProductListing', { slug: business?.slug })}
            >
              <Logo style={styles.logo}>
                <FastImage
                  style={styles.icon}
                  source={business?.logo?.includes('https') ? {
                    uri: business?.logo,
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.immutable
                  } : business?.logo ?? theme?.images?.dummies?.businessLogo}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </Logo>
              <Information>
                <View style={styles.header}>
                  <OText style={styles.title} numberOfLines={1}>
                    {business?.name}
                  </OText>
                </View>

                <OText style={styles.address} numberOfLines={1}>
                  {business?.address}
                </OText>

                <OText style={styles.address} numberOfLines={1}>
                  {business?.zipcode}
                </OText>
              </Information>
            </TouchableOpacity>

            <View
              style={{
                alignItems: 'flex-start',
              }}>
              {loading && isUpdateStore ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <ToggleSwitch
                  isOn={business?.enabled}
                  onColor={theme.colors.primary}
                  offColor={theme.colors.offColor}
                  size="small"
                  onToggle={handleSwitch}
                  disabled={loading}
                  animationSpeed={200}
                />
              )}
            </View>
          </View>
        </Card>
      )}
    </>
  );
};

export const BusinessController = (props: BusinessControllerParams) => {
  const BusinessControllerProps = {
    ...props,
    isDisabledInterval: true,
    UIComponent: BusinessControllerUI,
  };

  return <BusinessSingleCard {...BusinessControllerProps} />;
};
