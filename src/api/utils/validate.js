/**
 * Check if values are not undefined
 * @return undefined if any value is undefined, or returns values as JSON
 */
function bodyValidator(paramNames, reqBody) {
  const isUndefined = paramNames.some((param) => reqBody[param] === undefined);

  if (isUndefined) {
    return undefined;
  }
  
  const filteredBody = {};
  paramNames.forEach((param) => {
    filteredBody[param] = reqBody[param];
  });

  return filteredBody;
}
module.exports = bodyValidator
