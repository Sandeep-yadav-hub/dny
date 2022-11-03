import React from 'react';
import PropTypes from 'prop-types';
import { injectReducer, removeReducer } from '../helpers/utils';
import store from "../store";

const InjectReducer = reducer => WrappedComponent => {
  class InjectReducer extends React.Component {
    componentDidMount() {
        console.log(reducer)
        injectReducer(store, reducer);
    }
    componentWillUnmount() {
      removeReducer(store, reducer);
    }
    render() {
      return React.createElement(WrappedComponent, this.props);
    }
  }
  InjectReducer.contextTypes = {
    store: PropTypes.shape({
      replaceReducer: PropTypes.func.isRequired,
    }),
  };
  return InjectReducer;
};
export default InjectReducer;