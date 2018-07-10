import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Decimal from 'decimal.js-light';
import _ from 'underscore';

import { Field } from 'mitragyna';
import { Button, FormGroup, FormText,Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import Currency from 'react-currency-formatter';

import occsn from '../../../libs/Occasion';

export default class SpinButton extends PureComponent {
  static propTypes = {
    answer: PropTypes.instanceOf(occsn.Answer),
  };

  constructor() {
    super();

    _.bindAll(this,
      'decrementValue',
      'incrementValue',
    );
  }

  decrementValue() {
    let currentValue = this.fieldRef.getValue();

    this.fieldRef.setValue(currentValue - 1);
  }

  incrementValue() {
    let currentValue = this.fieldRef.getValue();

    this.fieldRef.setValue(currentValue + 1);
  }

  render() {
    let { answer } = this.props;

    let question = answer.question();

    let label = [
      <span className="mr-1">{ question.title }</span>
    ];

    label.push(<span className="mr-1">(Max of { question.max })</span>);

    if(question.required) {
      label.push(<span>*</span>);
    }

    let priceContribution;
    if(question.price) {
      let value = Decimal(answer.value);
      let price = Decimal(question.price);
      let currency = question.product().merchant().currency().name;

      priceContribution = <span>
        { answer.value } x { question.price } =&nbsp;
        <Currency currency={currency} quantity={price.times(value).toNumber()}></Currency>
      </span>;
    }

    return <FormGroup className="spin-button-container">
      <Label>{label}</Label>
      <InputGroup>
        <Field name="value" type="number" component={ Input }
               max={question.max} min={question.min}
               ref={(r) => this.fieldRef = r}>
        </Field>
        <InputGroupAddon addonType="append">
          <Button className="spin-button-minus" color='secondary' onClick={this.decrementValue}>-</Button>
          <Button className="spin-button-plus" color='secondary' onClick={this.incrementValue}>+</Button>
        </InputGroupAddon>
      </InputGroup>
      <FormText className="spin-button-calculation">{priceContribution}</FormText>
    </FormGroup>;
  }
}
