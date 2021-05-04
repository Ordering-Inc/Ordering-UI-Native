import styled, { css } from 'styled-components/native';
export const CContainer = styled.View`
  /* border-bottom: 1px solid #F0F0F0; */
`;
export const OrderBill = styled.View`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 10px;
  background-color: #FFF;
  /* table {
    width: 100%;
    font-size: 16px;
    font-weight: 300;

    td span {
      unicode-bidi: bidi-override;
    }

    tr td:nth-child(2) {
      font-weight: 500;
      text-align: right;
      ${props => {
  var _props$theme;

  return ((_props$theme = props.theme) === null || _props$theme === void 0 ? void 0 : _props$theme.rtl) && css`
        text-align: left;
    `;
}}
    }
  } */
  /* table.total {
    border-top: 1px solid #EAEAEA;
    padding-top: 10px;
    tr {
      td:nth-child(1) {
        font-weight: bold;
      }
      td:nth-child(2) {
        font-weight: bold;
        color: #D81212;
      }
    }
  } */
`;
export const CouponContainer = styled.View`
  width: 100%;
  margin: 10px;
`;
export const CheckoutAction = styled.View`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;
//# sourceMappingURL=styles.js.map