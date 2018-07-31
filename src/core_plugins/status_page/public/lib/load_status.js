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

import _ from 'lodash';

import chrome from 'ui/chrome';

async function loadStatus() {
  const response = await fetch(chrome.addBasePath('/api/status'), {
    method: 'get'
  });

  if (response.status >= 400) {
    throw new Error(`Request failed with status code: ${response.status}`);
  }

  const returnData = {};

  const data = await response.json();
  const metrics = data.metrics;

  if (metrics) {
    returnData.metrics = [{
      name: 'Heap Total',
      value: _.get(metrics, 'process.memory.heap.size_limit'),
      type: 'byte'
    }, {
      name: 'Heap Used',
      value: _.get(metrics, 'process.memory.heap.used_in_bytes'),
      type: 'byte'
    }, {
      name: 'Load',
      value: [
        _.get(metrics, 'os.load.1m'),
        _.get(metrics, 'os.load.5m'),
        _.get(metrics, 'os.load.15m')
      ],
      type: 'float'
    }, {
      name: 'Response Time Avg',
      value: _.get(metrics, 'response_times.avg_in_millis'),
      type: 'ms'
    }, {
      name: 'Response Time Max',
      value: _.get(metrics, 'response_times.max_in_millis'),
      type: 'ms'
    }, {
      name: 'Requests Per Second',
      value: _.get(metrics, 'requests.total') * 1000 / _.get(metrics, 'collection_interval_in_millis')
    }];
  }

  returnData.name = data.name;
  returnData.statuses = data.status.statuses;

  // TODO: error handling
  // const overall = data.status.overall;
  // if (!ui.serverState || (ui.serverState !== overall.state)) {
  //   ui.serverState = overall.state;
  //   ui.serverStateMessage = overall.title;
  // }

  return returnData;
}

export default loadStatus;