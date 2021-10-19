import _ from 'lodash';
import { Request, Response } from 'express';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, label, printf, json, colorize, splat } = format;

export const logger = createLogger({
  level: 'verbose',
  format: combine(
    colorize({
      all: false,
      colors: {
        http: 'magenta', info: 'green', error: 'red', verbose: 'blue',
      },
    }),
    splat(),
    json(),
    label({ label: 'my-app-api' }),
    timestamp({
      format: 'YY-MMM-DD HH:mm:ss',
    }),
    printf((info) => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`),
  ),
  transports: [new transports.Console()],
});

export const output = (req: Request, res: Response & { responseTime: number }): string => {
  let textOutput = `${req.method} - ${res.statusCode} ${req.url} ${res.responseTime}ms`;
  if (!_.isEmpty(req.params)) {
    const keys = Object.keys(req.params);
    const queryData = keys.map((key) => `${key}: ${req.params[key]}`).join(', ');
    textOutput = `${textOutput}
Params - ${queryData}`;
  }

  if (!_.isEmpty(req.query)) {
    const keys = Object.keys(req.query);
    const queryData = keys.map((key) => `${key}: ${req.query[key]}`).join(', ');
    textOutput = `${textOutput}
Query - ${queryData}`;
  }

  return textOutput;
};
