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

import loadStatus from '../lib/load_status';

import React, { Component } from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingSpinner,
  EuiText
} from '@elastic/eui';

import MetricTile from './metric_tile';
import StatusTable from './status_table';

class StatusApp extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      data: null
    };
  }

  componentDidMount = async function () {
    try {
      this.setState({
        data: await loadStatus(),
        loading: false
      });
    } catch (e) {
      console.error(e);
      this.setState({ fetchError: true, loading: false });
    }
  }

  render() {
    const { loading, data } = this.state;

    if (loading) {
      return (
        <EuiLoadingSpinner size="l" />
      );
    }

    return [
      <EuiFlexGroup wrap>
        {
          data.metrics.map(metric => (
            <EuiFlexItem
              style={{ minWidth: 'calc(33% - 24px)' }}
            >
              <MetricTile metric={metric} />
            </EuiFlexItem>
          ))
        }
      </EuiFlexGroup>,
      <EuiText>
        <h2>Status Breakdown</h2>
      </EuiText>,
      <StatusTable statuses={data.statuses} />
    ];
  }
}

export default StatusApp;
