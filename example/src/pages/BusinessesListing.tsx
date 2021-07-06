import React from 'react';
import { BusinessesListing as BusinessListingController } from '../components/BusinessesListing';
import styled from 'styled-components/native';
import { colors, images } from '../theme.json';

const BusinessesListing = (props: any) => {
  const BusinessesListingProps = {
    ...props,
    isSearchByName: true,
    isSearchByDescription: true,
    propsToFetch: [
      'id',
      'name',
      'header',
      'logo',
      'location',
      'schedule',
      'open',
      'delivery_price',
      'distance',
      'delivery_time',
      'pickup_time',
      'reviews',
      'featured',
      'offers',
      'food',
      'laundry',
      'alcohol',
      'groceries',
      'slug',
		'address'
    ],
    onBusinessClick: (business: any) => {
      props.navigation.navigate('Business', {
        store: business.slug,
        header: business.header,
        logo: business.logo,
      });
    },
  };

  const BusinessListView = styled.View`
    flex: 1;
    background-color: ${colors.clear};
  `;

  return (
    <BusinessListView>
      <BusinessListingController {...BusinessesListingProps} />
    </BusinessListView>
  );
};

export default BusinessesListing;
