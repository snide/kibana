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

import formatNumber from '../lib/format_number';
import React, { Component } from 'react';
import {
  EuiPanel,
  EuiText
} from '@elastic/eui';

class MetricTile extends Component {
  formattedMetric() {
    const { value, type } = this.props.metric;

    const metrics = [].concat(value);
    return metrics.map(function (metric) {
      return formatNumber(metric, type);
    }).join(', ');
  }

  render() {
    const { name } = this.props.metric;

    return (
      <EuiPanel>
        <EuiText style={{ textAlign: 'right' }}>
          <h4 className="title">{ name }</h4>
          <h2 className="average">{ this.formattedMetric() }</h2>
        </EuiText>
      </EuiPanel>
    );
  }
}

export default MetricTile;
