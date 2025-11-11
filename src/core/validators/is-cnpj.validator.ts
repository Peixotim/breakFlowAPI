import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isCnpj', async: false })
export class IsCnpjConstraint implements ValidatorConstraintInterface {
  validate(cnpj: string): boolean {
    if (typeof cnpj !== 'string') return false;

    const digits = cnpj.replace(/\D/g, '');

    if (digits.length !== 14) return false;

    if (/^(\d)\1{13}$/.test(digits)) return false;

    const MULTIPLIERS_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const MULTIPLIERS_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const calcCheckDigit = (base: string, multipliers: number[]): number => {
      const sum = [...base].reduce(
        (acc, num, i) => acc + Number(num) * multipliers[i],
        0,
      );
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const firstCheck = calcCheckDigit(digits.slice(0, 12), MULTIPLIERS_1);
    const secondCheck = calcCheckDigit(digits.slice(0, 13), MULTIPLIERS_2);

    return (
      firstCheck === Number(digits[12]) && secondCheck === Number(digits[13])
    );
  }

  defaultMessage(): string {
    return 'O CNPJ informado é inválido.';
  }
}

export function IsCnpj(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsCnpjConstraint,
    });
  };
}
