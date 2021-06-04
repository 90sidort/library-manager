const createErrorMessage = async (errors) => {
  let errorMessage = '';
  await errors.forEach((e, i) => {
    // eslint-disable-next-line prefer-template
    errorMessage =
      errorMessage + `${i + 1}. ${e.param.toUpperCase()}: ${e.msg} \n`;
  });
  return errorMessage;
};

module.exports = createErrorMessage;
