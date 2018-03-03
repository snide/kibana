const type = 'operator';

const operators = {
  ':': {
    description: '<span class="suggestionItem__callout">equals</span> some value',
    fieldTypes: ['string', 'number', 'date', 'ip', 'geo_point', 'geo_shape', 'boolean']
  },
  '<=': {
    description: 'is <span class="suggestionItem__callout">less than or equal to</span> some value',
    fieldTypes: ['number', 'date', 'ip']
  },
  '>=': {
    description: 'is <span class="suggestionItem__callout">greater than or equal to</span> to some value',
    fieldTypes: ['number', 'date', 'ip']
  },
  '<': {
    description: 'is <span class="suggestionItem__callout">less than</span> some value',
    fieldTypes: ['number', 'date', 'ip']
  },
  '>': {
    description: 'is <span class="suggestionItem__callout">greater than</span> some value',
    fieldTypes: ['number', 'date', 'ip']
  },
  ':*': {
    description: '<span class="suggestionItem__callout">exists</span>'
  },
};

function getDescription({ fieldName, operator }) {
  const { description } = operators[operator];
  return `<p>Filter results where ${fieldName} ${description}</p>`;
}

export function getSuggestionsProvider({ indexPattern }) {
  return function getOperatorSuggestions({ end, fieldName }) {
    const field = indexPattern.fields.byName[fieldName];
    if (!field) return [];
    const matchingOperators = Object.keys(operators).filter(operator => {
      const { fieldTypes } = operators[operator];
      return !fieldTypes || fieldTypes.includes(field.type);
    });
    const suggestions = matchingOperators.map(operator => {
      const text = operator + ' ';
      const description = getDescription({ fieldName, operator });
      return { type, text, description, start: end, end };
    });
    return Promise.resolve(suggestions);
  };
}
