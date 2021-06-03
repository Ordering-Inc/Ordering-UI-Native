import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { useLanguage } from 'ordering-components/native';

import { Container } from '../layouts/Container';
import GridContainer from '../layouts/GridContainer';
import NavBar from '../components/NavBar';
import {
  OCard,
  OSegment,
  OText
} from '../components/shared';
import { DELIVERY_TYPE_IMAGES } from '../config/constants';

const CategoryPage = () => {
  const [, t] = useLanguage()
  const [curTab, onChangeStatus] = useState(0);

  
  let items = [
    {
      text: 'Dessert',
    },
    {
      text: 'Burgers',
    },
    {
      text: 'Tacos',
    },
    {
      text: 'Asian',
    },
    {
      text: 'Mexican',
    },
    {
      text: 'Pizza',
    },
    {
      text: 'Burgers',
    },
    {
      text: 'Tacos',
    },
    {
      text: 'Asian',
    },
    {
      text: 'Mexican',
    }
  ];

  const onChangeTabs = (idx: number) => {
    onChangeStatus(idx);
  }

  return (
		<Container nopadding>
      <View style={{ paddingVertical: 20 }}>
        <NavBar
          title={t('CATEGORY', 'Category')}
        />
        <OSegment
          items={items} 
          selectedIdx={curTab} 
          onSelectItem={onChangeTabs}
        />
      </View>

      <View style={{ paddingHorizontal: 20, paddingVertical: 8 }}>
        <OText
          size={_dim.width * 0.09}
          weight="bold"
        >
          {t('DESSERT', 'Dessert')}
        </OText>
      </View>

      <GridContainer
        style={{
          justifyContent: 'space-between',
        }}
      >
        <OCard
          title="Excepteur et eu laboris enim ipsum incididunt do."
          image={DELIVERY_TYPE_IMAGES.eatIn}
          price="$10.99"
          prevPrice="$8.99"
          description="Laboris ex ullamco ut eiusmod dolor ad dolore. Elit fugiat laboris ex laborum magna nulla duis sit incididunt nisi eu anim. Laboris dolore ullamco dolore dolore."
          onPress={() => { console.log('xxxxxxx') }}
          badgeText="-$2.00"
        />

        <OCard
          title="Excepteur et eu laboris enim ipsum incididunt do."
          image={DELIVERY_TYPE_IMAGES.eatIn}
          price="$10.99"
          description="Laboris ex ullamco ut eiusmod dolor ad dolore. Elit fugiat laboris ex laborum magna nulla duis sit incididunt nisi eu anim. Laboris dolore ullamco dolore dolore."
        />

        <OCard
          title="Excepteur et eu laboris enim ipsum incididunt do."
          image={DELIVERY_TYPE_IMAGES.eatIn}
          price="$10.99"
          prevPrice="$8.99"
          description="Laboris ex ullamco ut eiusmod dolor ad dolore. Elit fugiat laboris ex laborum magna nulla duis sit incididunt nisi eu anim. Laboris dolore ullamco dolore dolore."
          badgeText="-$2.00"
        />
      </GridContainer>
		</Container>
	);
};

const _dim = Dimensions.get('window');

export default CategoryPage;
