import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isCpf', async: false })
export class IsCpfConstraint implements ValidatorConstraintInterface {
  validate(cpf: string): boolean {
    if (typeof cpf !== 'string') return false;

    const digits = cpf.replace(/\D/g, '');

    if (digits.length !== 11) return false;

    if (/^(\d)\1{10}$/.test(digits)) return false;

    const calcCheckDigit = (baseLength: number): number => {
      const sum = digits
        .slice(0, baseLength)
        .split('')
        .reduce((acc, num, i) => acc + Number(num) * (baseLength + 1 - i), 0);

      const remainder = (sum * 10) % 11;
      return remainder === 10 ? 0 : remainder;
    };

    const firstCheck = calcCheckDigit(9);
    const secondCheck = calcCheckDigit(10);

    return (
      firstCheck === Number(digits[9]) && secondCheck === Number(digits[10])
    );
  }

  defaultMessage() {
    return `Error, the cpf is not valid !`;
  }
}

export function IsCpf(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsCpfConstraint,
    });
  };
}
