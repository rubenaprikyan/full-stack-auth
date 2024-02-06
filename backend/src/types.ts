import { Response } from 'express';
import { RequestWithFiles } from './modules/file-upload';
import { UserAuthSession } from './database/entities';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type BaseViewModel<T = any> = {
  data: T;
};

interface ContextualRequest extends RequestWithFiles {
  session: UserAuthSession;
}

/**
 * Context with files
 */
export type Context = {
  req: ContextualRequest;
  res: Response;
};
