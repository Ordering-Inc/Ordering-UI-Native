import React from 'react';
import { Dimensions, Text } from 'react-native';
import { useLanguage, useApi } from 'ordering-components/native';

import { Container } from '../layouts/Container';
import { BusinessProductsListing } from '../components/BusinessProductsListing';

const BusinessPage = () => {
	const [, t] = useLanguage()


	// const { store } = useParams()
  const [ordering] = useApi()
  // const { search } = useLocation()

  // let category
  // let product

  /* if (search) {
    const data = search.substring(1).split('&')
    category = data[0]
    product = data[1]
  } */
  // const categoryId = category && category.split('=')[1]
  // const productId = product && product.split('=')[1]

  const businessProductsProps = {
    ordering,
    isSearchByName: true,
    isSearchByDescription: true,
    slug: '41',
    // categoryId,
    // productId,
    langFallbacks: null,
    businessProps: [
			'name',
      'id',
      'name',
      'header',
      'logo',
      'name',
      'open',
      'about',
      'description',
      'address',
      'location',
      'timezone',
      'schedule',
      'service_fee',
      'delivery_price',
      'distance',
      'delivery_time',
      'gallery',
      'pickup_time',
      'reviews',
      'featured',
      'offers',
      'food',
      'laundry',
      'alcohol',
      'groceries',
      'slug',
      'products',
      'zones'
    ],
    handleSearchRedirect: () => {},
    onProductRedirect: (x:any) => {},
    onCheckoutRedirect: (cartUuid:any) => {}
  }

  return (
		<Container>

			<Text>Business Page</Text>

			<BusinessProductsListing
				{...businessProductsProps}
			/>

		</Container>
	);
};

const _dim = Dimensions.get('window');
const _offset = 50;

export default BusinessPage;
