import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Cart from '../pages/Cart';
import Home from '../pages/Home';
import Details from '../pages/Details';
import Checkout from '../pages/Checkout';

class Content extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={ Home } />
        <Route path="/cart" component={ Cart } />
        <Route path="/details/:id" component={ Details } />
        <Route path="/checkout" component={ Checkout } />
      </Switch>
    );
  }
}

export default Content;
