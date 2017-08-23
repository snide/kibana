import React from 'react';

import {
  KuiFlexGroup,
  KuiFlexItem,
} from '../../../../components';

export default () => (
  <div>
    <KuiFlexGroup growItems={false}>
      <KuiFlexItem>These items...</KuiFlexItem>
      <KuiFlexItem>... will auto size to the size of their content.</KuiFlexItem>
    </KuiFlexGroup>

    <KuiFlexGroup>
      <KuiFlexItem grow={false}>This item wont grow</KuiFlexItem>
      <KuiFlexItem>But this item will.</KuiFlexItem>
    </KuiFlexGroup>
  </div>
);
