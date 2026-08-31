function handleError(res, header) {
  const errRes = {
    status: 'failed',
    message: 'invalid input or invalid id'
  };
  res.writeHead(400, header);
  res.write(JSON.stringify(errRes))
  res.end();
}

module.exports = handleError;