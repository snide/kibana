import _ from 'lodash';
import * as ast from '../ast';
import * as literal from '../node_types/literal';
import * as wildcard from '../node_types/wildcard';
import { getPhraseScript } from 'ui/filter_manager/lib/phrase';
import { getFields } from './utils/get_fields';

export function buildNodeParams(fieldName, value, isPhrase = false) {
  if (_.isUndefined(fieldName)) {
    throw new Error('fieldName is a required argument');
  }
  if (_.isUndefined(value)) {
    throw new Error('value is a required argument');
  }

  const fieldNode = typeof fieldName === 'string' ? ast.fromLiteralExpression(fieldName) : literal.buildNode(fieldName);
  const valueNode = typeof value === 'string' ? ast.fromLiteralExpression(value) : literal.buildNode(value);
  const isPhraseNode = literal.buildNode(isPhrase);

  return {
    arguments: [fieldNode, valueNode, isPhraseNode],
  };
}

export function toElasticsearchQuery(node, indexPattern) {
  const { arguments: [ fieldNameArg, valueArg, isPhraseArg ] } = node;

  const value = !_.isUndefined(valueArg) ? ast.toElasticsearchQuery(valueArg) : valueArg;
  const type = isPhraseArg.value ? 'phrase' : 'best_fields';

  if (fieldNameArg.value === null) {
    return {
      multi_match: {
        type,
        query: value,
        lenient: true,
      }
    };
  }

  const fields = getFields(fieldNameArg, indexPattern);
  const isExistsQuery = valueArg.type === 'wildcard' && value === '*';
  const isMatchAllQuery = isExistsQuery && fields && fields.length === indexPattern.fields.length;

  if (isMatchAllQuery) {
    return { match_all: {} };
  }

  const queries = fields.reduce((accumulator, field) => {
    if (field.scripted) {
      // Exists queries don't make sense for scripted fields
      if (!isExistsQuery) {
        return [...accumulator, {
          script: {
            ...getPhraseScript(field, value)
          }
        }];
      }
    }
    else if (isExistsQuery) {
      return [...accumulator, {
        exists: {
          field: field.name
        }
      }];
    }
    else if (valueArg.type === 'wildcard') {
      return [...accumulator, {
        query_string: {
          fields: [field.name],
          query: wildcard.toQueryStringQuery(valueArg),
        }
      }];
    }
    else {
      const queryType = type === 'phrase' ? 'match_phrase' : 'match';
      return [...accumulator, {
        [queryType]: {
          [field.name]: value
        }
      }];
    }
  }, []);

  return {
    bool: {
      should: queries,
      minimum_should_match: 1
    }
  };
}

