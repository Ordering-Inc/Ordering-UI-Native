import React from 'react';
import {
  BusinessController as BusinessSingleCard,
  useUtils,
  useOrder,
  useLanguage,
} from 'ordering-components/native';
import {OIcon, OText} from '../shared';
import {StyleSheet} from 'react-native';
import {colors} from '../../theme';
import {BusinessControllerParameters} from '../../types';
import {convertHoursToMinutes} from '../../utils';
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

export const BusinessControllerUI = (props: BusinessControllerParameters) => {
  const {business} = props;
  const [{parsePrice, parseDistance, parseNumber}] = useUtils();
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
    <Card>
      <BusinessHero
        source={{uri: business?.header}}
        imageStyle={styles.headerStyle}>
        <BusinessState>
          <OText color={colors.white} size={24} style={styles.businessState}>
            {t('PREORDER', 'PREORDER')}
          </OText>
        </BusinessState>
        <BusinessLogo>
          <OIcon url={business?.logo} style={styles.businessLogo} />
        </BusinessLogo>
      </BusinessHero>
      <BusinessContent>
        <BusinessInfo>
          <OText size={20}>{business?.name}</OText>
          {business?.reviews?.total > 0 && (
            <Reviews>
              <IconAntDesign
                name="star"
                color={colors.primary}
                size={16}
                style={styles.starIcon}
              />
              <OText>{parseNumber(business?.reviews?.total)}</OText>
            </Reviews>
          )}
        </BusinessInfo>
        <BusinessCategory>
          <OText>{getBusinessType()}</OText>
        </BusinessCategory>
        <Metadata>
          <OText style={styles.metadata}>
            {convertHoursToMinutes(
              orderState?.options?.type === 1
                ? business?.delivery_time
                : business?.pickup_time,
            )}
          </OText>
          <OText style={styles.metadata}>
            {parseDistance(business?.distance)}
          </OText>
          <OText style={styles.metadata}>
            {parsePrice(business?.delivery_price)}
          </OText>
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
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  businessState: {
    backgroundColor: colors.lightGray,
    opacity: 0.8,
    width: 150,
    textAlign: 'center',
    borderRadius: 25,
  },
  metadata: {
    marginRight: 20,
  },
  starIcon: {
    marginTop: 1.5,
    marginHorizontal: 5,
  },
});

export const BusinessController = (props: any) => {
  const BusinessControllerProps = {
    ...props,
    UIComponent: BusinessControllerUI,
  };

  return <BusinessSingleCard {...BusinessControllerProps} />;
};
