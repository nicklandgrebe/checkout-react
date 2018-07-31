import React, { PureComponent } from 'react';

import _ from 'underscore';
import s from 'underscore.string';

import { ErrorsFor } from 'mitragyna';

import occsn from '../../../libs/Occasion';

import SpreedlyAPI from 'spreedly';

import { Col, FormGroup, Input, Label, Row, FormFeedback } from 'reactstrap';

import PaymentServiceProvider from './PaymentServiceProvider.jsx';
import CardNumber from './Spreedly/CardNumber.jsx';
import CVV from './Spreedly/CVV.jsx';

function camelCaseToDash (str) {
  return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
}

export default class Spreedly extends PaymentServiceProvider {
  constructor() {
    super();

    this.state = {
      month: null,
      full_name: null,
      year: null
    };
  }

  // Initializes the iFrame using the global SpreedlyAPI object imported as a separate script
  // @note Called on componentDidMount
  // @see PaymentServiceProvider#componentDidMount
  initializeForm() {
    SpreedlyAPI.init(global.OCCSN.spreedly_key, {
      "numberEl": "spreedly-number",
      "cvvEl": "spreedly-cvv"
    });

    let defaultInputStyle = {
      display: 'block',
      width: '80%',
      padding: '0.375rem 0.75rem',
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#495057',
      backgroundColor: '#fff',
      backgroundClip: 'padding-box',
      border: '1px solid #ced4da',
      borderRadius: '0.25rem',
      transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
    };

    const focusInputStyle = 'color: #495057;' +
      '  background-color: #fff;' +
      '  border-color: #80bdff;' +
      '  outline: 0;' +
      '  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25)';

    if(global.OCCSN.iframeInputStyles) {
      Object.assign(defaultInputStyle, global.OCCSN.iframeInputStyles);
    }

    // Covert to string and hyphen-case the keys
    let inputStyleString = '';
    for (let prop in defaultInputStyle) { inputStyleString += `${camelCaseToDash(prop)}: ${defaultInputStyle[prop]};` }

    SpreedlyAPI.on("ready", function () {
      SpreedlyAPI.setFieldType("number", "text");
      SpreedlyAPI.setNumberFormat("prettyFormat");
      SpreedlyAPI.setPlaceholder("number", "•••• •••• •••• ••••");
      SpreedlyAPI.setPlaceholder("cvv", "•••");
      SpreedlyAPI.setStyle("number", inputStyleString);
      SpreedlyAPI.setStyle("cvv", inputStyleString);
    });

    SpreedlyAPI.on('fieldEvent', function(name, type, activeEl, inputProperties) {
      if(type == 'focus'){
        SpreedlyAPI.setStyle(name, focusInputStyle);
      }

      if(type == 'blur'){
        SpreedlyAPI.setStyle(name, inputStyleString);
      }
    });

    SpreedlyAPI.on('errors', (errors) => {
      console.log(errors)
      this.paymentMethodDeferred.reject(
        _.map(errors, (error) => {
          return [
            'creditCard.' + s.camelize(error.attribute, true),
            error.key.replace('errors.', ''),
            error.message
          ];
        })
      )
    });

    SpreedlyAPI.on('paymentMethod', (token) => {
      this.paymentMethodDeferred.resolve(occsn.CreditCard.build({ id: token }));
    });
  }

  // Triggers paymentMethod event
  tokenizePaymentMethodData() {
    SpreedlyAPI.tokenizeCreditCard(this.state);
  }

  handleChange = (name, e) => {
    this.setState({
      [name]: e.target.value
    })
  }

  render() {
    const { order } = this.props;

    return <section className="spreedly-container">
      <FormGroup className="spreedly-full-name">
        <label>Name On Card</label>
        <Input type="text" id="full_name" name="full_name" placeholder="Name On Card"
               onChange={ (e) => this.handleChange('full_name', e) }
               className={ (order.errors().forField('creditCard.firstName').empty() && order.errors().forField('creditCard.lastName').empty()) ? '' : 'is-invalid' }
        />
        <ErrorsFor className="spreedly-first-name-errors" component={FormFeedback} field='creditCard.firstName'></ErrorsFor>
        <ErrorsFor className="spreedly-last-name-errors" component={FormFeedback} field='creditCard.lastName'></ErrorsFor>
      </FormGroup>

      <FormGroup className="spreedly-card-number">
        <Label>Credit Card Number</Label>
        <div class="custom-file">
          <div className="custom-file-input is-invalid" style={{ opacity: 1 }}>
            <CardNumber />
          </div>
          <ErrorsFor className="spreedly-card-number-errors" component={FormFeedback} field='creditCard.number'></ErrorsFor>
        </div>
      </FormGroup>

      <FormGroup className="spreedly-expiration-cvv">
        <Row>
          <Col className="spreedly-expiration" xs="6">
            <Label>Expiration Date</Label>
            <Row>
              <Col xs="6">
                <Input type="text" id="month" name="month" maxlength="2" placeholder="MM"
                       onChange={ (e) => this.handleChange('month', e) }
                       className={ order.errors().forField('creditCard.year').empty() ? '' : 'is-invalid' }
                />
                <ErrorsFor className="spreedly-expiration-month-errors" component={FormFeedback} field='creditCard.month'></ErrorsFor>
              </Col>
              <Col xs="6">
                <Input type="text" id="year" name="year" maxlength="4" placeholder="YYYY"
                       onChange={ (e) => this.handleChange('year', e) }
                       className={ order.errors().forField('creditCard.year').empty() ? '' : 'is-invalid' }
                />
                <ErrorsFor className="spreedly-expiration-year-errors" component={FormFeedback} field='creditCard.year'></ErrorsFor>
              </Col>
            </Row>
          </Col>
          <Col className="spreedly-cvv" xs="3">
            <CVV />
          </Col>
        </Row>
      </FormGroup>
    </section>;
  }
}
