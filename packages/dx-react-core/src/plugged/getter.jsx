import React from 'react';
import PropTypes from 'prop-types';
import { argumentsShallowEqual } from '../utils/shallow-equal';
import { getAction } from '../utils/plugin-helpers';

function getterMemoize(func) {
  let lastArg = null;
  let lastResult = null;
  return (...args) => {
    if (
      lastArg === null ||
      !argumentsShallowEqual(lastArg, args)
    ) {
      lastResult = func(...args);
    }
    lastArg = args;
    return lastResult;
  };
}

export const UPDATE_CONNECTION = 'updateConnection';

export class Getter extends React.PureComponent {
  componentWillMount() {
    const { pluginHost } = this.context;
    const { name, pureComputed } = this.props;
    const pureComputedMemoized = getterMemoize(pureComputed);

    this.plugin = {
      position: () => this.props.position(),
      [`${name}Getter`]: (original) => {
        const { value, connectArgs } = this.props;
        if (value !== undefined) return value;

        let args = [];
        if (connectArgs) {
          const getter = (getterName) => {
            if (getterName === name) return original;

            return pluginHost.get(`${getterName}Getter`, this.plugin);
          };
          args = connectArgs(getter, actionName => getAction(pluginHost, actionName));
        }
        return pureComputedMemoized(...args);
      },
    };

    pluginHost.registerPlugin(this.plugin);
  }
  componentDidUpdate() {
    const { pluginHost } = this.context;

    pluginHost.broadcast(UPDATE_CONNECTION);
  }
  componentWillUnmount() {
    const { pluginHost } = this.context;

    pluginHost.unregisterPlugin(this.plugin);
  }
  render() {
    return null;
  }
}

Getter.propTypes = {
  position: PropTypes.func,
  name: PropTypes.string.isRequired,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  pureComputed: PropTypes.func,
  connectArgs: PropTypes.func,
};

Getter.defaultProps = {
  value: undefined,
  pureComputed: null,
  connectArgs: null,
  position: null,
};

Getter.contextTypes = {
  pluginHost: PropTypes.object.isRequired,
};
