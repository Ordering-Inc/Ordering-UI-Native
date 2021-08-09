import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import {
  BusinessTypeFilter as BusinessTypeFilterController,
  useLanguage,
} from 'ordering-components/native';

import {
  BusinessCategoriesTitle,
  BusinessCategories,
  Category,
  BCContainer,
} from './styles';
import { OIcon, OText } from '../shared';
import { colors, images } from '../../theme.json';
import { BusinessTypeFilterParams } from '../../types';

export const BusinessTypeFilterUI = (props: BusinessTypeFilterParams) => {
  const { typesState, currentTypeSelected, handleChangeBusinessType } = props;

  const [, t] = useLanguage();

  const renderTypes = ({ item }: any) => {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handleChangeBusinessType(item.id)}
        style={{
          height: 34,
          justifyContent: 'center',
          borderBottomWidth: 1,
          borderBottomColor: currentTypeSelected === item.id ? colors.textNormal : colors.border,
        }}>
        <OText
          style={{ textAlign: 'center', paddingHorizontal: 5 }}
          size={currentTypeSelected === item.id ? 14 : 12}
          weight={currentTypeSelected === item.id ? 'bold' : 'normal'}
          color={
            currentTypeSelected === item.id
              ? colors.textNormal
              : colors.textSecondary
          }>
          {t(
            `BUSINESS_TYPE_${item.name.replace(/\s/g, '_').toUpperCase()}`,
            item.name,
          )}
        </OText>
      </TouchableOpacity>
    );
  };

  return (
    <BCContainer>
      {typesState?.loading && (
        <View>
          <Placeholder style={{ marginVertical: 10 }} Animation={Fade}>
            <ScrollView
              horizontal
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              {[...Array(4)].map((_, i) => (
                <View
                  key={i}
                  style={{ width: 80, borderRadius: 10, marginRight: 15 }}>
                  <PlaceholderLine height={80} noMargin />
                </View>
              ))}
            </ScrollView>
          </Placeholder>
        </View>
      )}
      {!typesState?.loading &&
        !typesState?.error &&
        typesState?.types &&
        typesState?.types.length > 0 && (
          <>
            <BusinessCategoriesTitle>
              
            </BusinessCategoriesTitle>
            <BusinessCategories>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={typesState?.types}
                renderItem={renderTypes}
                keyExtractor={(type) => type.name}
              />
            </BusinessCategories>
          </>
        )}
    </BCContainer>
  );
};

const styles = StyleSheet.create({
  icons: {
    padding: 10,
  },
  logo: {
    width: 75,
    height: 75,
    marginBottom: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const BusinessTypeFilter = (props: BusinessTypeFilterParams) => {
  const businessTypeFilterProps = {
    ...props,
    UIComponent: BusinessTypeFilterUI,
    businessTypes: props.businessTypes,
    defaultBusinessType: props.defaultBusinessType || null,
    onChangeBusinessType: props.handleChangeBusinessType,
  };

  return <BusinessTypeFilterController {...businessTypeFilterProps} />;
};
