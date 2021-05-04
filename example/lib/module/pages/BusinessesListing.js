import React from 'react';
import { BusinessesListing as BusinessListingController } from '../components/BusinessesListing';
import styled from 'styled-components/native';
import { colors } from '../theme';

const BusinessesListing = props => {
  const BusinessesListingProps = { ...props,
    isSearchByName: true,
    isSearchByDescription: true,
    propsToFetch: ['id', 'name', 'header', 'logo', 'location', 'schedule', 'open', 'delivery_price', 'distance', 'delivery_time', 'pickup_time', 'reviews', 'featured', 'offers', 'food', 'laundry', 'alcohol', 'groceries', 'slug'],
    onBusinessClick: business => {
      props.navigation.navigate('Business', {
        store: business.slug
      });
    }
  };
  const BusinessListView = styled.SafeAreaView`
    flex: 1;
    background-color: ${colors.backgroundPage};
  `;
  return /*#__PURE__*/React.createElement(BusinessListView, null, /*#__PURE__*/React.createElement(BusinessListingController, BusinessesListingProps));
};

export default BusinessesListing;
//# sourceMappingURL=BusinessesListing.js.map