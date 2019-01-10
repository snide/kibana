/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import chrome from 'ui/chrome';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { uiModules } from 'ui/modules';
import { timefilter } from 'ui/timefilter';
import { Provider } from 'react-redux';
import { getStore } from '../store/store';
import { GisMap } from '../components/gis_map';
import {
  setSelectedLayer,
  setTimeFilters,
  setRefreshConfig,
  setGoto,
  replaceLayerList,
} from '../actions/store_actions';
import { updateFlyout, FLYOUT_STATE } from '../store/ui';
import { Inspector } from 'ui/inspector';
import { inspectorAdapters } from '../kibana_services';
import { SavedObjectSaveModal } from 'ui/saved_objects/components/saved_object_save_modal';
import { showSaveModal } from 'ui/saved_objects/show_saved_object_save_modal';
import { toastNotifications } from 'ui/notify';

const REACT_ANCHOR_DOM_ELEMENT_ID = 'react-gis-root';

const app = uiModules.get('app/gis', []);

app.controller('GisMapController', ($scope, $route, config, kbnUrl) => {

  const savedMap = $scope.map = $route.current.locals.map;
  let unsubscribe;

  inspectorAdapters.requests.reset();

  getStore().then(store => {

    // clear old UI state
    store.dispatch(setSelectedLayer(null));
    store.dispatch(updateFlyout(FLYOUT_STATE.NONE));

    // sync store with savedMap mapState
    if (savedMap.mapStateJSON) {
      const mapState = JSON.parse(savedMap.mapStateJSON);
      const timeFilters = mapState.timeFilters ? mapState.timeFilters : timefilter.getTime();
      store.dispatch(setTimeFilters(timeFilters));
      store.dispatch(setGoto({
        lat: mapState.center.lat,
        lon: mapState.center.lon,
        zoom: mapState.zoom,
      }));
      if (mapState.refreshConfig) {
        store.dispatch(setRefreshConfig(mapState.refreshConfig));
      }
    }
    const layerList = savedMap.layerListJSON ? JSON.parse(savedMap.layerListJSON) : [];
    store.dispatch(replaceLayerList(layerList));

    const root = document.getElementById(REACT_ANCHOR_DOM_ELEMENT_ID);
    render(
      <Provider store={store}>
        <GisMap/>
      </Provider>,
      root);
  });

  $scope.$on('$destroy', () => {
    if (unsubscribe) {
      unsubscribe();
    }
    const node = document.getElementById(REACT_ANCHOR_DOM_ELEMENT_ID);
    if (node) {
      unmountComponentAtNode(node);
    }
  });

  $scope.getMapTitle = function () {
    return $scope.map.title;
  };
  // k7design breadcrumbs
  // TODO subscribe to store change and change when store updates title
  chrome.breadcrumbs.set([
    { text: 'Map', href: '#' },
    { text: $scope.getMapTitle() }
  ]);
  config.watch('k7design', (val) => $scope.showPluginBreadcrumbs = !val);

  async function doSave(saveOptions) {
    const store = await  getStore();
    savedMap.syncWithStore(store.getState());

    let id;
    try {
      id = await savedMap.save(saveOptions);
    } catch(err) {
      toastNotifications.addDanger({
        title: `Error on saving '${savedMap.title}'`,
        text: err.message,
        'data-test-subj': 'saveMapError',
      });
      return { error: err };
    }

    if (id) {
      toastNotifications.addSuccess({
        title: `Saved '${savedMap.title}'`,
        'data-test-subj': 'saveMapSuccess',
      });

      if (savedMap.id !== $route.current.params.id) {
        $scope.$evalAsync(() => {
          kbnUrl.change(`map/{{id}}`, { id: savedMap.id });
        });
      }
    }
    return { id };
  }

  $scope.topNavMenu = [{
    key: 'inspect',
    description: 'Open Inspector',
    testId: 'openInspectorButton',
    run() {
      Inspector.open(inspectorAdapters, {});
    }
  }, {
    key: 'save',
    description: 'Save map',
    testId: 'mapSaveButton',
    run: async () => {
      const onSave = ({ newTitle, newCopyOnSave, isTitleDuplicateConfirmed, onTitleDuplicate }) => {
        const currentTitle = savedMap.title;
        savedMap.title = newTitle;
        savedMap.copyOnSave = newCopyOnSave;
        const saveOptions = {
          confirmOverwrite: false,
          isTitleDuplicateConfirmed,
          onTitleDuplicate,
        };
        return doSave(saveOptions).then(({ id, error }) => {
          // If the save wasn't successful, put the original values back.
          if (!id || error) {
            savedMap.title = currentTitle;
          }
          return { id, error };
        });
      };

      const saveModal = (
        <SavedObjectSaveModal
          onSave={onSave}
          onClose={() => {}}
          title={savedMap.title}
          showCopyOnSave={savedMap.id ? true : false}
          objectType={'gis-map'}
        />);
      showSaveModal(saveModal);
    }
  }];
  timefilter.enableTimeRangeSelector();
  timefilter.enableAutoRefreshSelector();
});
