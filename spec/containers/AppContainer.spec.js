import React from 'react';
import { AppContainer } from '../../app/containers/AppContainer.jsx';

import axios from 'axios';
import occsn from '../../app/libs/Occasion';

import productFixture from '../fixtures/products/cash.json';
import blankQuestionsFixture from '../fixtures/blank.json';

describe('AppContainer', () => {
  let wrapper;
  const mockLoadProduct = jest.fn();

  beforeEach(async () => {
    axios._setMockResponses({
      '/products': { status: 200, data: productFixture },
      '/questions': { status: 200, data: blankQuestionsFixture },
    });

    let props = {
      actions: {
        loadProduct: mockLoadProduct
      },
      data: {
        product: await occsn.Product.find(1)
      }
    };

    wrapper = shallow(<AppContainer {...props} />);
  });

  it('calls loadProduct', () => {
    expect(mockLoadProduct.mock.calls.length).toBe(1);
  });

  it('displays product title', () => {
    expect(wrapper.find('p').text()).toBe(productFixture.data.attributes.title);
  });
});
