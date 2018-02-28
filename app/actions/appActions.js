import occsn from '../libs/Occasion';

import actionTypes from '../constants/appConstants';

export function constructOrder(product) {
  return dispatch => {
    dispatch(constructOrderRequest());

    return occsn.Order.construct({ product, status: 'initialized' }).then(order => {
      dispatch(setOrder(order));
    });
  };
}

export function constructOrderRequest() {
  return {
    type: actionTypes.CONSTRUCT_ORDER_REQUEST
  };
}

export function loadProduct(id) {
  return dispatch => {
    dispatch(loadProductRequest());

    var query =
      occsn.Product
      .includes('merchant', { venue: 'state' })
      .find(id);

    return query.then(product => {
      dispatch(setProduct(product));
      dispatch(constructOrder(product));
    });
  };
}

export function loadProductRequest() {
  return {
    type: actionTypes.LOAD_PRODUCT_REQUEST
  };
}

export function setOrder(order) {
  return {
    type: actionTypes.SET_ORDER,
    order
  };
}

export function setProduct(product) {
  return {
    type: actionTypes.SET_PRODUCT,
    product
  };
}
