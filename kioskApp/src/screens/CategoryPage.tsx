import React from 'react';
import CategoriesMenu from '../components/CategoriesMenu';

const CategoryPage = (props: any): React.ReactElement => {
  return (
    <CategoriesMenu
      {...props}
    />
	);
};

export default CategoryPage;
