export interface BaseField {
  name: string,
  value: string,
  label: string,
}

export interface InputField extends BaseField {
}

type Option = {
  label: string;
  value: string | number;
}

export interface SelectField {
  isMulti: boolean;
  options: Option[];
  value: string | string[]
}

export type AdvSearchFormField = InputField | SelectField