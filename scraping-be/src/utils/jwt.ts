import jwt from 'jsonwebtoken';
import { Decode, JwtPayload } from '../types';
import bcrypt from 'bcrypt';
import { JWT_SECRET, JWT_EXPIRATION } from '../constants';
import { logger } from './logger';

class JWTUtils {
  /**
   * Generate access token
   *
   * @param {string} username
   * @param {string | number} userId
   *
   * @returns {string}
   */
  public generateAccessToken(username: string, userId: string | number): string {
    return jwt.sign({ username, userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  }

  /**
   * Decode token
   *
   * @param {string} token
   * @returns {Decode}
   */
  public decode(token: string): Decode {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      logger.info('decoded token: ', decoded);
      return { valid: true, expired: false, decoded };
    } catch (error: any) {
      logger.error('decode jwt token: ', error.message);
      return {
        valid: false,
        expired: error.message === 'jwt expired',
        decoded: null,
      };
    }
  }

  /**
   * Generate hashed password
   *
   * @param {string} password
   * @returns {Promise<string>}
   */
  public async generateHashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  /**
   * Compare password
   *
   * @param {string} password
   * @param {string} hashedPassword
   * @returns {Promise<boolean>}
   */
  public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}

const jwtUtils = new JWTUtils();

export { jwtUtils };
