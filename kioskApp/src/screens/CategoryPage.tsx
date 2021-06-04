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

const CategoryPage = (props: any): React.ReactElement => {

  const {
    navigation,
    route,
  } = props;

  const { category, categories } = route.params;

  const [, t] = useLanguage();
  const [curIndexCateg, setIndexCateg] = useState(categories.indexOf(category));
  
  const onChangeTabs = (idx: number) => setIndexCateg(idx);

  const goToBack = () => navigation.goBack()

  return (
		<Container nopadding>
      <View style={{ paddingVertical: 20 }}>
        <NavBar
          title={t('CATEGORY', 'Category')}
          onActionLeft={goToBack}
        />
        <OSegment
          items={categories.map((category:any) => ({
            text: category.name
          }))}
          selectedIdx={curIndexCateg} 
          onSelectItem={onChangeTabs}
        />
      </View>

      <View style={{ paddingHorizontal: 20, paddingVertical: 8 }}>
        <OText
          size={_dim.width * 0.09}
          weight="bold"
        >
          {categories[curIndexCateg].name}
        </OText>
      </View>

      <GridContainer
        style={{ justifyContent: 'space-between' }}
      >
        {categories[curIndexCateg].products.map((product:any) => (
          <OCard
            key={product.id}
            title={!!product?.name && product?.name}
            image={{ uri: product?.images }}
            price={product?.price && `$${product?.price}`}
            prevPrice={product?.in_offer && `$${product?.offer_price}`}
            description={!!product?.description && product?.description}
            onPress={() => {
              
            }}
          />
        ))}
      </GridContainer>
		</Container>
	);
};

const _dim = Dimensions.get('window');

export default CategoryPage;
