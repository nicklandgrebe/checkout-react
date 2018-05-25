import mirrorCreator from 'mirror-creator';

const actionTypes = mirrorCreator([
  'BOOK_ORDER_REQUEST',
  'BOOK_ORDER_REQUEST_COMPLETE',
  'CONSTRUCT_ORDER_REQUEST',
  'FIND_REDEEMABLE_REQUEST',
  'FIND_REDEEMABLE_REQUEST_COMPLETE',
  'LOAD_PRODUCT_REQUEST',
  'SAVE_ORDER_REQUEST',
  'SAVE_ORDER_REQUEST_COMPLETE',
  'SET_ORDER',
  'SET_PRODUCT',
]);

export default actionTypes;
