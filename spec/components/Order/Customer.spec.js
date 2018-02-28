import React from 'react';

import { Resource } from 'mitragyna';

import Order from '../../../app/components/Order';
import Customer from '../../../app/components/Customer';

import axios from 'axios';
import occsn from '../../../app/libs/Occasion';

import productFixture from 'fixtures/products/cash.json';
import blankQuestionsFixture from 'fixtures/blank.json';

import initializedOrderFixture from 'fixtures/orders/initialized/free.json';
import partialCustomerOrderFixture from 'fixtures/orders/customer/partial.json';
import completeCustomerOrderFixture from 'fixtures/orders/customer/complete.json';

describe('Order', () => {
  describe('Customer', () => {
    let order, product, wrapper, customerWrapper;

    const mockSetOrder = jest.fn();

    async function setupWrapper(orderResponses) {
      let responses = {
        '/products/:id/': { status: 200, data: productFixture },
        '/products/:id/questions/': { status: 200, data: blankQuestionsFixture },
        ...orderResponses
      };
      axios._setMockResponses(responses);

      product = await occsn.Product.find('1');
      order = await occsn.Order.construct({ product, status: 'initialized' });

      order = await order.save();

      let props = {
        component: Order,
        subject: order,
        afterUpdate: mockSetOrder
      };

      wrapper = mount(<Resource {...props} />);
      customerWrapper = wrapper.find(Customer).first();
    }

    context('on change', () => {
      beforeEach(async () => {
        await setupWrapper({
          '/orders/': { status: 201, data: initializedOrderFixture },
          '/orders/:id': { status: 200, data: partialCustomerOrderFixture },
        });

        var emailInput = customerWrapper.find('input').first();
        emailInput.simulate('change', { target: { value: 'nick@example.com' } });
        emailInput.simulate('blur');

        await axios.wait(1000);
      });

      it('calls setOrder', () => {
        expect(mockSetOrder.mock.calls.length).toBe(1);
      });

      it('matches snapshot', () => {
        wrapper.update();
        expect(wrapper.find(Customer).first().find('section').first()).toMatchSnapshot();
      });
    });

    context('complete customer', () => {
      beforeEach(async () => {
        await setupWrapper({
          '/orders/': { status: 201, data: completeCustomerOrderFixture },
          '/orders/:id': { status: 200, data: completeCustomerOrderFixture },
        });
      });

      it('matches snapshot', () => {
        expect(customerWrapper.find('section').first()).toMatchSnapshot();
      });
    });
  });
});
