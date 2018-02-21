import grammar from 'raw-loader!./kuery.peg';
import kqlGrammar from 'raw-loader!./kql.peg';
import PEG from 'pegjs';
import _ from 'lodash';
import { nodeTypes } from '../node_types/index';

const kueryParser = PEG.buildParser(grammar);
const kqlParser = PEG.buildParser(kqlGrammar, {
  allowedStartRules: ['start', 'Literal'],
});

export function fromLiteralExpression(expression, parseOptions) {
  parseOptions = {
    ...parseOptions,
    startRule: 'Literal',
  };

  return fromExpression(expression, parseOptions, kqlParser);
}

export function fromKueryExpression(expression, parseOptions) {
  return fromExpression(expression, parseOptions, kueryParser);
}

export function fromKqlExpression(expression, parseOptions) {
  return fromExpression(expression, parseOptions, kqlParser);
}

function fromExpression(expression, parseOptions = {}, parser = kqlParser) {
  if (_.isUndefined(expression)) {
    throw new Error('expression must be a string, got undefined instead');
  }

  parseOptions = {
    ...parseOptions,
    helpers: { nodeTypes }
  };

  return parser.parse(expression, parseOptions);
}

export function toElasticsearchQuery(node, indexPattern) {
  if (!node || !node.type || !nodeTypes[node.type]) {
    return toElasticsearchQuery(nodeTypes.function.buildNode('and', []));
  }

  return nodeTypes[node.type].toElasticsearchQuery(node, indexPattern);
}
