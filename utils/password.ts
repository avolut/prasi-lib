import * as _bcrypt from "lib/utils/bcrypt";
export const bcrypt = _bcrypt;

export const hashPassword = (pass: string) => {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(pass, salt);
  return hash;
};
export const matchingPassword = async (a: string, b: string) => {
  let result =  await bcrypt.compareSync(a, b);
  return result;
};

export const password = {
  hash: hashPassword,
  match: matchingPassword,
};
