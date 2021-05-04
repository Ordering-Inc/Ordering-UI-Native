"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _native = _interopRequireDefault(require("styled-components/native"));

var _Utilities = require("../providers/Utilities");

var _shared = require("./shared");

var _OrderItem = _interopRequireDefault(require("./OrderItem"));

var _native2 = require("@react-navigation/native");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Wrapper = _native.default.View`
flex: 1;
    background-color: white;
    padding-horizontal: 12px;
    padding-top: 110px;
    padding-bottom: 20px;
`;
const FilterWrapper = _native.default.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-vertical: 10px;
    z-index: 10;
`;
const OrdersWrapper = _native.default.ScrollView`
    
`;
const orderStatus = [['Group', (0, _Utilities.getOrderStatus)(0), (0, _Utilities.getOrderStatus)(4), (0, _Utilities.getOrderStatus)(7)], // pending
['Group', (0, _Utilities.getOrderStatus)(3), (0, _Utilities.getOrderStatus)(8)], // inprogress
['Group', (0, _Utilities.getOrderStatus)(1), (0, _Utilities.getOrderStatus)(9), (0, _Utilities.getOrderStatus)(11)], // completed
['Group', (0, _Utilities.getOrderStatus)(2), (0, _Utilities.getOrderStatus)(5), (0, _Utilities.getOrderStatus)(6), (0, _Utilities.getOrderStatus)(10), (0, _Utilities.getOrderStatus)(12)] // canceled
];
const dateFilters = ['Today', 'Last Week', 'Older'];

const OrderList = props => {
  let items = [{
    text: 'Pending',
    image: require('../assets/icons/pending.png')
  }, {
    text: 'InProgress',
    image: require('../assets/icons/inprogress.png')
  }, {
    text: 'Completed',
    image: require('../assets/icons/completed.png')
  }, {
    text: 'Canceled',
    image: require('../assets/icons/canceled.png')
  }]; // Events -----------

  const [statusFilters, getFilterTypes] = React.useState(orderStatus[0]);
  var [curTab, onChangeStatus] = React.useState(0);
  const [online, updateOnline] = React.useState(props.isOnline);
  React.useEffect(() => {
    updateOnline(props.isOnline);
  }, [props.isOnline]);

  const onChangeTabs = idx => {
    // alert(`Selectd Order Status : ${items[idx].text}`);
    onChangeStatus(idx);
    getFilterTypes(orderStatus[idx]);
  };

  const filterOrders = (orders, tab) => {
    var ary = [];

    if (tab == 0) {
      ary = orders.filter(item => item.status == 0 || item.status == 4 || item.status == 7);
    } else if (tab == 1) {
      ary = orders.filter(item => item.status == 3 || item.status == 8);
    } else if (tab == 2) {
      ary = orders.filter(item => item.status == 1 || item.status == 9 || item.status == 11);
    } else if (tab == 3) {
      ary = orders.filter(item => item.status == 2 || item.status == 5 || item.status == 6 || item.status == 10 || item.status == 12);
    }

    return ary;
  };

  const filterByGroup = idx => {// alert( `Groupd : ${statusFilters[idx]}`);
  };

  const filterByDate = idx => {// alert( `Date : ${dateFilters[idx]}`);
  };

  const onClickOrder = data => {
    // alert(data.business.name);
    if (curTab == 0 && !online) {
      alert('You are offline.');
      return;
    }

    let detailStack = _native2.StackActions.push('OrderDetail', {
      order: data,
      status: curTab
    });

    props.navigation.dispatch(detailStack); // props.navigation.navigate('OrderDetail', {order: data, status: curTab});
  };

  return /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(_shared.OSegment, {
    items: items,
    selectedIdx: curTab,
    onSelectItem: onChangeTabs
  }), /*#__PURE__*/React.createElement(FilterWrapper, null, /*#__PURE__*/React.createElement(_shared.ODropDown, {
    items: statusFilters,
    placeholder: 'Group',
    kindImage: require('../assets/icons/group.png'),
    selectedIndex: 0,
    onSelect: filterByGroup
  }), curTab > 0 ? /*#__PURE__*/React.createElement(_shared.OText, {
    style: {
      minWidth: 10
    }
  }, '') : null, curTab > 0 ? /*#__PURE__*/React.createElement(_shared.ODropDown, {
    items: dateFilters,
    placeholder: 'Today',
    kindImage: require('../assets/icons/calendar.png'),
    selectedIndex: 0,
    onSelect: filterByDate
  }) : null), /*#__PURE__*/React.createElement(OrdersWrapper, null, filterOrders(props.orders, curTab).map((item, index) => /*#__PURE__*/React.createElement(_OrderItem.default, {
    key: index,
    isOnline: online,
    data: item,
    canAccept: curTab == 0 ? true : false,
    onClick: onClickOrder
  }))));
};

var _default = OrderList;
exports.default = _default;
//# sourceMappingURL=OrderList.js.map