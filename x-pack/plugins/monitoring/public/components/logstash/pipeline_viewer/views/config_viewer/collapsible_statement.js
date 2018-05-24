/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';

import {
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiCodeBlock,
  EuiFlexItem,
  EuiFlexGroup
} from '@elastic/eui';

function clickableStatementName(name, onVertexSelected) {
  return (
    <EuiFlexItem
      grow={false}
      key="nameSection"
    >
      <EuiButtonEmpty
        color="text"
        size="xs"
        onClick={onVertexSelected}
        className="cv-ifElseStatement__title"
      >
        <span className="cv-ifElseStatement__name">{name}</span>
      </EuiButtonEmpty>
    </EuiFlexItem>
  );
}

function ifStatement(statement, onVertexSelected) {
  const { condition } = statement;
  return [
    clickableStatementName('if', onVertexSelected),
    (
      <EuiFlexItem
        key="ifSection"
        grow={false}
      >
        <EuiCodeBlock
          fontSize="s"
          paddingSize="none"
          transparentBackground={true}
          className="cv-ifStatement__condition"
        >
          {condition}
        </EuiCodeBlock>
      </EuiFlexItem>
    )
  ];
}

export class CollapsibleStatement extends React.PureComponent {
  constructor(props) {
    super(props);

    this.toggleClicked = this.toggleClicked.bind(this);
    this.getToggleIconType = this.getToggleIconType.bind(this);
  }

  toggleClicked() {
    const {
      collapse,
      expand,
      id,
      isCollapsed
    } = this.props;

    if (isCollapsed) {
      expand(id);
    } else {
      collapse(id);
    }
  }

  getToggleIconType() {
    const { isCollapsed } = this.props;
    return isCollapsed ? 'arrowRight' : 'arrowDown';
  }

  getStatementBody() {
    const {
      isIf,
      statement,
      onShowVertexDetails
    } = this.props;

    const { vertex } = statement;
    const showVertexDetailsClicked = () => { onShowVertexDetails(vertex); };

    return isIf ?
      ifStatement(statement, showVertexDetailsClicked)
      : clickableStatementName('else', showVertexDetailsClicked);
  }

  render() {
    const { id } = this.props;
    return (
      <EuiFlexGroup gutterSize="xs">
        <EuiFlexItem
          key={`${id}_collapseSection`}
          grow={false}
        >
          <EuiButtonIcon
            color="text"
            size="s"
            aria-label
            iconType={this.getToggleIconType()}
            onClick={this.toggleClicked}
            className="cv-ifElseStatement__toggle"
          />
        </EuiFlexItem>
        {this.getStatementBody()}
      </EuiFlexGroup>
    );
  }
}
