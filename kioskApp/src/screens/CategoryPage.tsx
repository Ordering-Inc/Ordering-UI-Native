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
        <OCard/>
        <OCard/>
        <OCard/>
        <OCard/>
        <OCard/>
      </GridContainer>
		</Container>
	);
};

const _dim = Dimensions.get('window');

export default CategoryPage;
