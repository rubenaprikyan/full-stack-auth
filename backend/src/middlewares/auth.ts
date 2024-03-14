import { NextFunction, Request, Response } from 'express';

import CustomDataSource from '../database/data-source';

import AuthService, { Payload } from '../services/AuthService';
import ClientService from '../services/ClientService';

import { dbConfig } from '../config';
import { AuthorizationError } from '../modules/exceptions/AuthorizationError';

const userService = new ClientService(CustomDataSource.getInstance(dbConfig));

/**
 * Extracts token from request headers
 * @param headers
 * @returns {String} token
 */
function extractToken(headers): string {
  let token = '';
  if (headers.authorization) {
    const header = headers.authorization.split(' ');
    if (header[0] === 'Bearer') {
      token = header[1];
    }
  }
  return token;
}

function raiseUnauthorizedException(next: NextFunction) {
  const err = new AuthorizationError('');
  next(err);
}

async function auth(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req.headers);

  // if there is no token, it is unauthorized request
  if (!token) {
    raiseUnauthorizedException(next);
    return;
  }

  try {
    // Verify the token using the secret key
    const decoded = AuthService.verifyJWT(token) as Payload;
    const session = await userService.getSessionByToken(token, decoded.email);

    if (!session) {
      raiseUnauthorizedException(next);
      return;
    }

    /* extra validation of salt in the payload */
    if (session.user.accessTokenSalt !== decoded.salt) {
      raiseUnauthorizedException(next);
      return;
    }

    /*
     * check if user active, maybe another logic need to apply here
     * or show another error
     **/
    if (!session.user.active) {
      raiseUnauthorizedException(next);
      return;
    }
    // currently it's impossible to solve this error without extra efforts
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    req.session = session;
    req.headers.token = token;

    next();
  } catch (e: unknown) {
    raiseUnauthorizedException(next);
  }
}

export default auth;
