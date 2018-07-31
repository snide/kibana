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
import PropTypes from 'prop-types';
import {
  EuiLoadingSpinner,
  EuiText,
  EuiSpacer
} from '@elastic/eui';

import MetricTiles from './metric_tiles';
import StatusTable from './status_table';
import ServerStatus from './server_status';

class StatusApp extends Component {
  static propTypes = {
    buildNum: PropTypes.number.isRequired,
    buildSha: PropTypes.string.isRequired,
  };

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
    const { buildNum, buildSha } = this.props;
    const { loading, data } = this.state;

    // If we're still loading, return early with a spinner
    if (loading) {
      return (
        <EuiLoadingSpinner size="l" />
      );
    }

    // Extract the items needed to render each component
    const { metrics, statuses, serverState, name } = data;

    return [
      <ServerStatus
        name={name}
        serverState={serverState}
      />,
      <EuiSpacer />,
      <MetricTiles metrics={metrics} />,
      <EuiSpacer />,
      <EuiText>
        <h2>Status Breakdown</h2>
      </EuiText>,
      <StatusTable statuses={statuses} />,
      <EuiSpacer />,
      <EuiText textAlign="right">
        Build { buildNum }, Commit SHA { buildSha }
      </EuiText>
    ];
  }
}

export default StatusApp;
