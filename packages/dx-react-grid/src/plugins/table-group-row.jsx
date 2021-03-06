import React from 'react';
import PropTypes from 'prop-types';
import { Getter, Template, PluginContainer } from '@devexpress/dx-react-core';
import {
  tableColumnsWithGrouping,
  tableRowsWithGrouping,
  isGroupTableCell,
  isGroupIndentTableCell,
} from '@devexpress/dx-grid-core';

const pluginDependencies = [
  { pluginName: 'GroupingState' },
  { pluginName: 'TableView' },
];

export class TableGroupRow extends React.PureComponent {
  render() {
    const {
      groupCellTemplate,
      groupIndentCellTemplate,
      groupIndentColumnWidth,
    } = this.props;

    return (
      <PluginContainer
        pluginName="TableGroupRow"
        dependencies={pluginDependencies}
      >
        <Getter
          name="tableColumns"
          pureComputed={tableColumnsWithGrouping}
          connectArgs={getter => [
            getter('tableColumns'),
            getter('grouping'),
            getter('draftGrouping'),
            groupIndentColumnWidth,
          ]}
        />
        <Getter
          name="tableBodyRows"
          pureComputed={tableRowsWithGrouping}
          connectArgs={getter => [
            getter('tableBodyRows'),
          ]}
        />

        <Template
          name="tableViewCell"
          predicate={({ tableRow, tableColumn }) => isGroupTableCell(tableRow, tableColumn)}
          connectGetters={getter => ({ expandedGroups: getter('expandedGroups') })}
          connectActions={action => ({ toggleGroupExpanded: action('toggleGroupExpanded') })}
        >
          {({ expandedGroups, toggleGroupExpanded, ...params }) => groupCellTemplate({
            ...params,
            row: params.tableRow.row,
            column: params.tableColumn.column,
            isExpanded: expandedGroups.has(params.tableRow.row.key),
            toggleGroupExpanded: () => toggleGroupExpanded({ groupKey: params.tableRow.row.key }),
          })}
        </Template>
        {groupIndentCellTemplate && (
          <Template
            name="tableViewCell"
            predicate={({ tableRow, tableColumn }) => isGroupIndentTableCell(tableRow, tableColumn)}
          >
            {params => groupIndentCellTemplate({
              ...params,
              row: params.tableRow.row,
              column: params.tableColumn.column,
            })}
          </Template>
        )}
      </PluginContainer>
    );
  }
}

TableGroupRow.propTypes = {
  groupCellTemplate: PropTypes.func.isRequired,
  groupIndentCellTemplate: PropTypes.func,
  groupIndentColumnWidth: PropTypes.number.isRequired,
};

TableGroupRow.defaultProps = {
  groupIndentCellTemplate: null,
};
