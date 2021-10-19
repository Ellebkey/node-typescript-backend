// eslint-disable-next-line max-classes-per-file

/**
 * @extends Error
 */
export default class APIError extends Error {
  status: number;
  message: string;
  tag: string;
  stack: string;

  constructor(
    tag: string,
    message: string,
    status: number,
    stack?: string,
  ) {
    super(message);
    this.tag = tag;
    this.message = message;
    this.status = status;
    this.stack = stack;
  }
}
