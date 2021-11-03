/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
module.exports.errorReceiver = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.log(`Error:${err.name}`);

  return res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
};
