import React from 'react';
import {
  BusinessController as BusinessSingleCard,
  useUtils,
  useOrder,
  useLanguage,
} from 'ordering-components/native';
import { OIcon, OText } from '../shared';
import { ImageStore, StyleSheet, View } from 'react-native';
import { colors, images } from '../../theme.json';
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
  const { business, handleClick } = props;
  const [{ parsePrice, parseDistance, parseNumber, optimizeImage }] =
    useUtils();
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
        isClosed={business?.open}>
        {business?.featured && (
          <View style={styles.featured}>
            <FontAwesomeIcon name="crown" size={26} color="gold" />
          </View>
        )}
        <BusinessState>
          {!business?.open && (
            <View style={styles.businessStateView}>
              <OText
                color={colors.textThird}
                size={10}
                style={styles.businessStateText}>
                {t('PREORDER', 'PREORDER')}
              </OText>
            </View>
          )}
        </BusinessState>
      </BusinessHero>
      <BusinessContent>
        <BusinessInfo>
          <BusinessLogo style={styles.businessLogo}>
            <OIcon
              url={optimizeImage(business?.logo, 'h_300,c_limit')}
              width={56}
              height={56}
            />
          </BusinessLogo>
          {business?.reviews?.total > 0 && (
            <Reviews>
              <OIcon src={images.general.star} width={12} style={styles.starIcon} />
              <OText size={10} style={{lineHeight: 15}}>
                {parseNumber(business?.reviews?.total, { separator: '.' })}
              </OText>
            </Reviews>
          )}
        </BusinessInfo>
        <OText
          size={12}
          style={{ lineHeight: 18, marginBottom: 6 }}
          weight={'500'}>
          {business?.name}
        </OText>
        <OText size={10} style={{ lineHeight: 15, marginBottom: 3 }}>
          {business?.address}
        </OText>
        {/* <BusinessCategory>
          <OText>{getBusinessType()}</OText>
        </BusinessCategory> */}
        <Metadata>
		  {!business?.open ? (
          <View style={styles.closed}>
            <OText size={10} color={colors.red}>
              {t('CLOSED', 'Closed')}
            </OText>
          </View>
        ) : (
          <View style={styles.bullet}>
            <OText size={10} color={colors.textSecondary}>
					{`${t('DELIVERY_FEE', 'Delivery fee')} ${parsePrice(business?.delivery_price) + ' \u2022 '}`}
            </OText>
            <OText size={10} color={colors.textSecondary}>{`${convertHoursToMinutes(
					orderState?.options?.type === 1
					? business?.delivery_time
					: business?.pickup_time,
					)} \u2022 `}</OText>
				<OText size={10} color={colors.textSecondary}>{parseDistance(business?.distance)}</OText>
          </View>
		  )}
        </Metadata>
      </BusinessContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    borderTopLeftRadius: 7.6,
    borderTopRightRadius: 7.6,
  },
  businessLogo: {
    backgroundColor: 'white',
    width: 62,
    height: 62,
    borderRadius: 7.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -32,
	 shadowColor: '#000000',
	 shadowOffset: {width: 0, height: 1},
	 shadowOpacity: 0.1,
	 shadowRadius: 1
  },
  businessStateView: {
    backgroundColor: '#DEE2E6',
    borderRadius: 50,
	 height: 20,
	 alignItems: 'center',
	 justifyContent: 'center',
	 paddingHorizontal: 8,
  },
  businessStateText: {
    textAlign: 'center',
  },

  starIcon: {
    marginHorizontal: 2,
	 marginTop: -2,
  },
  featured: {
    position: 'absolute',
    padding: 8,
    backgroundColor: colors.backgroundDark,
    opacity: 0.8,
    borderRadius: 10,
    left: 20,
    top: 10,
  },
  closed: {
  },
  bullet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export const BusinessController = (props: BusinessControllerParams) => {
  const BusinessControllerProps = {
    ...props,
    UIComponent: BusinessControllerUI,
  };

  return <BusinessSingleCard {...BusinessControllerProps} />;
};
