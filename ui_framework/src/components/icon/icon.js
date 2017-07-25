import React, {
  PropTypes,
} from 'react';
import classNames from 'classnames';

import '!!svg-sprite!./assets/app_dashboard.svg';
import '!!svg-sprite!./assets/app_devtools.svg';
import '!!svg-sprite!./assets/app_discover.svg';
import '!!svg-sprite!./assets/app_graph.svg';
import '!!svg-sprite!./assets/app_ml.svg';
import '!!svg-sprite!./assets/app_timelion.svg';
import '!!svg-sprite!./assets/app_visualize.svg';
import '!!svg-sprite!./assets/apps.svg';
import '!!svg-sprite!./assets/logo.svg';
import '!!svg-sprite!./assets/search.svg';
import '!!svg-sprite!./assets/user.svg';
import '!!svg-sprite!./assets/help.svg';
import '!!svg-sprite!./assets/cross.svg';
import '!!svg-sprite!./assets/grid.svg';
import '!!svg-sprite!./assets/arrow_top.svg';
import '!!svg-sprite!./assets/arrow_right.svg';
import '!!svg-sprite!./assets/arrow_bottom.svg';
import '!!svg-sprite!./assets/arrow_left.svg';
import '!!svg-sprite!./assets/console.svg';

const humanizeCamelCase = str => (
  // Put spaces between words in camel-cased strings.
  str.replace(/([A-Z])/g, g => ` ${g[0].toLowerCase()}`)
);

const typeToIconMap = {
  dashboardApp: 'app_dashboard',
  devToolsApp: 'app_devtools',
  discoverApp: 'app_discover',
  graphApp: 'app_graph',
  machineLearningApp: 'app_ml',
  timelionApp: 'app_timelion',
  visualizeApp: 'app_visualize',
  apps: 'apps',
  kibanaLogo: 'logo',
  search: 'search',
  user: 'user',
  help: 'help',
  cross: 'cross',
  grid: 'grid',
  arrowTop: 'arrow_top',
  arrowBottom: 'arrow_bottom',
  arrowLeft: 'arrow_left',
  arrowRight: 'arrow_right',
  console: 'console',
};

export const TYPES = Object.keys(typeToIconMap);

const sizeToClassNameMap = {
  medium: 'kuiIcon--medium',
  large: 'kuiIcon--large',
  xLarge: 'kuiIcon--xLarge',
  xxLarge: 'kuiIcon--xxLarge',
};

export const SIZES = Object.keys(sizeToClassNameMap);

export const KuiIcon = ({
  type,
  size,
  className,
  title,
  ...rest,
}) => {
  const classes = classNames('kuiIcon', className, sizeToClassNameMap[size]);
  const titleElement =
    title
    ? <title>{title}</title>
    : <title>{`${humanizeCamelCase(type)} icon`}</title>;
  const svgReference = type ? <use href={`#${typeToIconMap[type]}`} /> : undefined;

  return (
    <svg
      className={classes}
      {...rest}
    >
      {titleElement}
      {svgReference}
    </svg>
  );
};

KuiIcon.propTypes = {
  type: PropTypes.oneOf(TYPES),
  size: PropTypes.oneOf(SIZES),
  title: PropTypes.string,
};

KuiIcon.defaultProps = {
  size: 'medium',
};
