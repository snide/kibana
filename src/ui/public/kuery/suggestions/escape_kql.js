import { compose } from 'lodash';

export function escapeQuotes(string) {
  return string.replace(/"/g, '\\"');
}

export const escapeKql = compose(escapeKeywords, escapeSpecialCharacters);

// See the SpecialCharacter rule in kql.peg
function escapeSpecialCharacters(string) {
  return string.replace(/[\\():<>"*]/g, '\\$&'); // $& means the whole matched string
}

// See the Keyword rule in kql.peg
function escapeKeywords(string) {
  return string.replace(/(\s+)(and|or|not)(\s+)/ig, '$1\\$2$3'); // $& means the whole matched string
}
