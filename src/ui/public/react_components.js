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

import 'ngreact';

import {
  KuiToolBarSearchBox,
} from '@kbn/ui-framework/components';

import { Timepicker } from 'ui/timepicker';

import {
  EuiConfirmModal,
  EuiIcon,
  EuiColorPicker,
  EuiIconTip,
  EuiCallOut,
} from '@elastic/eui';

import { uiModules } from './modules';

const app = uiModules.get('app/kibana', ['react']);

app.directive('toolBarSearchBox', reactDirective => reactDirective(KuiToolBarSearchBox));

app.directive('confirmModal', reactDirective => reactDirective(EuiConfirmModal));

app.directive('icon', reactDirective => reactDirective(EuiIcon));

app.directive('colorPicker', reactDirective => reactDirective(EuiColorPicker));

app.directive('iconTip', reactDirective => reactDirective(EuiIconTip, ['content', 'type', 'position', 'title', 'color']));

app.directive('callOut', reactDirective => reactDirective(EuiCallOut, ['title', 'color', 'size', 'iconType', 'children']));

app.directive('newKbnTimepicker', reactDirective => reactDirective(Timepicker, ['from', 'to', 'setTime']));
