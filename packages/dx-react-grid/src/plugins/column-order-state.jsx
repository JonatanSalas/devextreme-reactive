import React from 'react';
import PropTypes from 'prop-types';
import { Getter, Action, PluginContainer } from '@devexpress/dx-react-core';
import { orderedColumns, setColumnOrder } from '@devexpress/dx-grid-core';

export class ColumnOrderState extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      order: props.defaultOrder,
    };

    this._setColumnOrder = (order, { sourceColumnName, targetColumnName }) => {
      const { onOrderChange } = this.props;
      const nextOrder = setColumnOrder(order, { sourceColumnName, targetColumnName });
      this.setState({ order: nextOrder });
      if (onOrderChange) {
        onOrderChange(nextOrder);
      }
    };
  }
  render() {
    const {
      order = this.state.order,
    } = this.props;

    return (
      <PluginContainer
        pluginName="ColumnOrderState"
      >
        <Getter
          name="columns"
          pureComputed={orderedColumns}
          connectArgs={getter => [getter('columns'), order]}
        />
        <Action
          name="setColumnOrder"
          action={({ sourceColumnName, targetColumnName }) =>
            this._setColumnOrder(order, { sourceColumnName, targetColumnName })
          }
        />
      </PluginContainer>
    );
  }
}

ColumnOrderState.propTypes = {
  order: PropTypes.arrayOf(PropTypes.string),
  defaultOrder: PropTypes.arrayOf(PropTypes.string),
  onOrderChange: PropTypes.func,
};

ColumnOrderState.defaultProps = {
  order: undefined,
  defaultOrder: undefined,
  onOrderChange: undefined,
};
