import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { authConfig } from '../config';

/**
 * JWT Payload
 * can be added any other parameters later, like role etc.
 */
export type Payload = {
  /**
   * user email
   */
  userEmail: string;
  /**
   * users accessTokenSalt
   */
  salt: string;
};

class AuthService {
  /**
   * Generates password hash using bcrypt
   * @param {String} password
   * @param {Number} salt
   */
  public static generatePasswordHash(password = '', salt = 8) {
    return bcrypt.hashSync(password.trim(), salt);
  }

  /**
   * Compares password with its hash
   * @param {String} password
   * @param {String} candidate
   */
  public static comparePasswordHashes(password, candidate): boolean {
    return bcrypt.compareSync(candidate, password);
  }

  /**
   * checks jwt token verification
   * @param {String} token
   */
  public static verifyJWT(token: string): JwtPayload | string {
    return jwt.verify(token, authConfig.accessTokenSecret, {
      ignoreExpiration: true,
    });
  }

  /**
   * Creates JWT token, by injecting payload and expiration date
   * @param {Payload} payload
   * @returns {String} token
   */
  public static generateAuthToken(payload: Payload): string {
    // divided by 1000 since the jwt accepts seconds
    const iat = Math.floor(Date.now() / 1000);
    const finalDataToHash = {
      ...payload,
      iat,
    };

    return jwt.sign(finalDataToHash, authConfig.accessTokenSecret, {
      algorithm: 'HS512',
      expiresIn: Math.floor(authConfig.accessTokenLifetime / 1000),
    });
  }
}

export default AuthService;
