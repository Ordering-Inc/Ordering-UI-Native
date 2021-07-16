import React from 'react';
import BusinessMenu from '../components/BusinessMenu';

const BusinessPage = (props:any): React.ReactElement => {
  return (
    <BusinessMenu { ...props } />
  );
};

export default BusinessPage;
