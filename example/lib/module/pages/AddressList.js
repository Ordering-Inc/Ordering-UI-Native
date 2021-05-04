import React from 'react';
import { AddressList as AddressListController } from '../components/AddressList';
import { useSession } from 'ordering-components/native';

const AddressList = ({
  route,
  navigation
}) => {
  var _route$params, _route$params2, _route$params3;

  const [{
    user
  }] = useSession();
  const isGoBack = route === null || route === void 0 ? void 0 : (_route$params = route.params) === null || _route$params === void 0 ? void 0 : _route$params.isGoBack;
  const isFromBusinesses = route === null || route === void 0 ? void 0 : (_route$params2 = route.params) === null || _route$params2 === void 0 ? void 0 : _route$params2.isFromBusinesses;
  const isFromProductsList = route === null || route === void 0 ? void 0 : (_route$params3 = route.params) === null || _route$params3 === void 0 ? void 0 : _route$params3.isFromProductsList;
  const AddressListProps = {
    navigation,
    route,
    userId: user === null || user === void 0 ? void 0 : user.id,
    isGoBack,
    isFromBusinesses,
    isFromProductsList
  };
  return /*#__PURE__*/React.createElement(AddressListController, AddressListProps);
};

export default AddressList;
//# sourceMappingURL=AddressList.js.map