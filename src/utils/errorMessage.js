const createErrorMessage = async (errors) => {
  let errorMessage = '';
  await errors.forEach((e) => {
    // eslint-disable-next-line prefer-template
    errorMessage = errorMessage + `${e.param.toUpperCase()}: ${e.msg}` + '\n';
  });
  return errorMessage;
};

module.exports = createErrorMessage;
