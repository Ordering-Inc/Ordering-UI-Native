import React from 'react';
import {
  BusinessController as BusinessSingleCard,
  useUtils,
  useOrder,
  useLanguage,
} from 'ordering-components/native';
import { OIcon, OText } from '../shared';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme.json';
import { BusinessControllerParams } from '../../types';
import { convertHoursToMinutes } from '../../utils';
import {
  Card,
  BusinessHero,
  BusinessContent,
  BusinessCategory,
  BusinessInfo,
  Metadata,
  BusinessState,
  BusinessLogo,
  Reviews,
} from './styles';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export const BusinessControllerUI = (props: BusinessControllerParams) => {
  const { business, handleClick, isBusinessOpen } = props;
  const [{ parsePrice, parseDistance, parseNumber, optimizeImage }] = useUtils();
  const [orderState] = useOrder();
  const [, t] = useLanguage();

  const types = ['food', 'laundry', 'alcohol', 'groceries'];

  const getBusinessType = () => {
    if (Object.keys(business).length <= 0) return t('GENERAL', 'General');
    const _types: any = [];
    types.forEach((type) => {
      if (business[type]) {
        _types.push(t(type.toUpperCase(), type));
      }
    });
    return _types.join(', ');
  };

  return (
    <Card activeOpacity={1} onPress={() => handleClick(business)}>
      <BusinessHero
        source={{ uri: optimizeImage(business?.header, 'h_400,c_limit') }}
        imageStyle={styles.headerStyle}
        isClosed={isBusinessOpen}
      >
        {business?.featured && (
          <View style={styles.featured}>
            <FontAwesomeIcon name='crown' size={26} color='gold' />
          </View>
        )}
        {!isBusinessOpen && (
          <View style={styles.closed}>
            <OText size={32} color={colors.white}>{t('CLOSED', 'CLOSED')}</OText>
          </View>
        )}
        <BusinessLogo>
          <OIcon url={optimizeImage(business?.logo, 'h_300,c_limit')} style={styles.businessLogo} />
        </BusinessLogo>
        <BusinessState>
          {!isBusinessOpen && (
            <View style={styles.businessStateView}>
              <OText color={colors.white} size={20} style={styles.businessStateText}>
                {t('PREORDER', 'PREORDER')}
              </OText>
            </View>
          )}
        </BusinessState>
      </BusinessHero>
      <BusinessContent>
        <BusinessInfo>
          <View style={{ width: '70%', alignItems: 'flex-start' }}>
            <OText
                size={20}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
              {business?.name}
            </OText>
          </View>
          {business?.reviews?.total > 0 && (
            <Reviews>
              <IconAntDesign
                name="star"
                color={colors.primary}
                size={16}
                style={styles.starIcon}
              />
              <OText>{parseNumber(business?.reviews?.total, { separator: '.' })}</OText>
            </Reviews>
          )}
        </BusinessInfo>
        <BusinessCategory>
          <OText>{getBusinessType()}</OText>
        </BusinessCategory>
        <Metadata>
          <View style={styles.bullet}>
            <MaterialComIcon name='alarm' size={16} />
            <OText style={styles.metadata}>
              {convertHoursToMinutes(
                orderState?.options?.type === 1
                  ? business?.delivery_time
                  : business?.pickup_time,
              )}
            </OText>
          </View>
          <View style={styles.bullet}>
            <MaterialIcon name='location-on' size={16} />
            <OText style={styles.metadata}>
              {parseDistance(business?.distance)}
            </OText>
          </View>
          <View style={styles.bullet}>
            <MaterialComIcon name='truck-delivery' size={16} style={{ marginBottom: -2 }} />
            <OText style={styles.metadata}>
              {parsePrice(business?.delivery_price)}
            </OText>
          </View>
        </Metadata>
      </BusinessContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  businessLogo: {
    width: 75,
    height: 75,
    marginLeft: 20,
    marginBottom: 20,
    borderRadius: 25,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  businessStateView: {
    backgroundColor: '#6C6C6C',
    borderRadius: 10,
  },
  businessStateText: {
    color: colors.white,
    textAlign: 'center',
    padding: 8,
  },
  metadata: {
    marginRight: 20,
    marginLeft: 5,
    marginBottom: -5,
  },
  starIcon: {
    marginTop: 1.5,
    marginHorizontal: 5,
  },
  featured: {
    position: 'absolute',
    padding: 8,
    backgroundColor: colors.backgroundDark,
    opacity: 0.8,
    borderRadius: 10,
    left: 20,
    top: 10
  },
  closed: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundDark,
    opacity: 0.6,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  bullet: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export const BusinessController = (props: BusinessControllerParams) => {
  const BusinessControllerProps = {
    ...props,
    UIComponent: BusinessControllerUI,
  };

  return <BusinessSingleCard {...BusinessControllerProps} />;
};
