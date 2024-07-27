import * as cryptojs from 'crypto-js';
import * as argon2 from 'argon2';

export class CryptoUtil {
  static cryptoKey: string = '1';
  static async encryptAES(data: string) {
    return cryptojs.AES.encrypt(data, this.cryptoKey).toString();
  }

  static async decryptAES(data: string) {
    const decrypted = cryptojs.AES.decrypt(
      data.replace(/\s+/g, '+'),
      this.cryptoKey,
    );
    if (decrypted) {
      return decrypted.toString(cryptojs.enc.Utf8);
    } else {
      return false;
    }
  }

  static async hashPassword(password: string) {
    return await argon2.hash(password);
  }

  static async comparePassword(password: string, hash: string) {
    return await argon2.verify(hash, password);
  }
}
