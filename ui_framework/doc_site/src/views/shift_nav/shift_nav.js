import React, {
  Component,
} from 'react';

import {
  KuiShiftNav,
  KuiPopover,
  KuiButton,
} from '../../../../components';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPopoverOpen: false,
    };
  }

  onButtonClick() {
    this.setState({
      isPopoverOpen: !this.state.isPopoverOpen,
    });
  }

  closePopover() {
    this.setState({
      isPopoverOpen: false,
    });
  }

  render() {
    const button = (
      <KuiButton fill onClick={this.onButtonClick.bind(this)}>
        Click me
      </KuiButton>
    );

    return (
      <KuiPopover
        button={button}
        isOpen={this.state.isPopoverOpen}
        closePopover={this.closePopover.bind(this)}
        withTitle
      >
        <KuiShiftNav />
      </KuiPopover>
    );
  }
}
