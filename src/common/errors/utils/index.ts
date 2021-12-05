export function sendRequestError(result: any, error: any) {
  result.status(error.statusCode || 500).send(error);
}
