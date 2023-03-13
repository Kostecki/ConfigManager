import CryptoJS from "crypto-js";

const secret =
  (process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string) ??
  (process.env.ENCRYPTION_KEY as string);

const encrypt = (message: string) => {
  // CBC, 256
  return CryptoJS.AES.encrypt(message, secret).toString();
};
const decrypt = (cipher: string) => {
  const bytes = CryptoJS.AES.decrypt(cipher, secret);
  const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decrypted;
};

export { encrypt, decrypt };
