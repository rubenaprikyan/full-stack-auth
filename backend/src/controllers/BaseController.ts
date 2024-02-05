/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseViewModel } from '../types';

/**
 * Base Controller includes utilities for controllers
 * @abstract
 */
abstract class BaseController {
  /**
   * view
   * returns unified response object
   * {
   *   data: <the actual response>
   * }
   * @param result
   * @protected
   */
  protected view<T = any>(result: T): BaseViewModel<T> {
    return {
      data: result,
    };
  }
}

export default BaseController;
