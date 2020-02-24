export const emailValidator = (email: string): boolean => {
  return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(
    email,
  );
};

export const cpfValidator = async (cpf: string): Promise<boolean> => {
  let numbers: string;
  let result: number;
  let sum: number;
  let digits: string;

  let fixedCpf = cpf.replace(/[^0-9]/g, '');

  if (!/\d{11}/g.test(fixedCpf)) {
    return false;
  }

  numbers = fixedCpf.substring(0, 9);
  digits = fixedCpf.substring(9);
  sum = 0;
  for (let i = 10; i > 1; i--) {
    sum += parseInt(numbers.charAt(10 - i), 10) * i;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  if (result !== parseInt(digits.charAt(0), 10)) {
    return false;
  }

  numbers = fixedCpf.substring(0, 10);
  sum = 0;

  for (let i = 11; i > 1; i--) {
    sum += parseInt(numbers.charAt(11 - i), 10) * i;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  if (result !== parseInt(digits.charAt(1), 10)) {
    return false;
  }

  return true;
};
