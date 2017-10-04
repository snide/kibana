import grammar from 'raw-loader!./kuery.peg';
import PEG from 'pegjs';
import _ from 'lodash';
import { nodeTypes } from '../node_types/index';

const kueryParser = PEG.buildParser(grammar);

export function fromKueryExpression(expression, parseOptions = {}) {
  if (_.isUndefined(expression)) {
    throw new Error('expression must be a string, got undefined instead');
  }

  parseOptions = Object.assign({}, parseOptions, { helpers: { nodeTypes } });

  return kueryParser.parse(expression, parseOptions);
}

export function toKueryExpression(node) {
  if (!node || !node.type || !nodeTypes[node.type]) {
    return '';
  }

  return nodeTypes[node.type].toKueryExpression(node);
}

export function toElasticsearchQuery(node, indexPattern) {
  if (!node || !node.type || !nodeTypes[node.type]) {
    return toElasticsearchQuery(nodeTypes.function.buildNode('and', []));
  }

  return nodeTypes[node.type].toElasticsearchQuery(node, indexPattern);
}

export function getSuggestions(node, cursorPosition) {
  return nodeTypes[node.type].getSuggestions(node, cursorPosition);
}

export function getChildAtCursor(node, cursorPosition) {
  return (node.arguments || []).find(child => (
    child && child.location
    && child.location.min <= cursorPosition
    && child.location.max >= cursorPosition
  ));
}
