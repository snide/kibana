/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { Component } from 'react';
import {
  EuiBasicTable,
  EuiHealth,
} from '@elastic/eui';

class StatusTable extends Component {
  static columns = [{
    field: 'id',
    name: 'ID',
  }, {
    field: 'state',
    name: 'Status',
    render: state => <EuiHealth color={state.uiColor}>{ state.message }</EuiHealth>
  }];

  static getRowProps = ({ state }) => {
    return {
      className: `status-table-row-${state.uiColor}`
    };
  };

  render() {
    const { statuses } = this.props;

    if (!statuses) {
      return null;
    }

    return (
      <EuiBasicTable
        columns={StatusTable.columns}
        items={statuses}
        rowProps={StatusTable.getRowProps}
      />
    );
  }
}

export default StatusTable;
