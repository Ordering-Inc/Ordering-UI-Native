import React, { useRef, useState } from 'react';
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
import CartBottomSheet from '../components/CartBottomSheet';
import { Category } from '../types';

const CategoryPage = (props: any): React.ReactElement => {

  const {
    navigation,
    route,
  } = props;
  
  const { category, categories }: Params = route.params;

  const [, t] = useLanguage();
  const [curIndexCateg, setIndexCateg] = useState(categories.indexOf(category));
  const refRBSheet = useRef<any>(null);
  
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
          items={categories.map((category) => ({
            text: category.name
          }))}
          selectedIdx={curIndexCateg} 
          onSelectItem={onChangeTabs}
        />
      </View>

      <CartBottomSheet
        refRBSheet={refRBSheet}
      >
        <View style={{ paddingHorizontal: 20, paddingVertical: 8 }}>
          <OText
            size={_dim.width * 0.05}
            weight="bold"
          >
            {categories[curIndexCateg].name}
          </OText>
        </View>

        <GridContainer>
          {categories[curIndexCateg].products.map((product) => (
            <OCard
              key={product.id}
              title={product?.name}
              image={{ uri: product?.images }}
              onPress={() => {
                navigation.navigate('ProductDetails', { product });
              }}
              {...(!!product?.description && { description: product?.description } )}
              {...(!!product?.price && { price: `$${product?.price}` } )}
              {...(product?.in_offer && { prevPrice: `$${product?.offer_price}` } )}
            />
          ))}
        </GridContainer>
      </CartBottomSheet>
		</Container>
	);
};

interface Params {
  category: Category;
  categories: Category[];
}

const _dim = Dimensions.get('window');

export default CategoryPage;
