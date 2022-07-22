import { ChangeEvent } from "react";
import "./form-input.styles.scss";
type FormInputProps = {
  label: string;
  type: string;
  required: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  value: string;
};

const FormInput = ({ label, ...otherProps }: FormInputProps) => {
  return (
    <div className="group">
      <input className="form-input" {...otherProps} />
      {label && <label className={"form-input-label"}>{label}</label>}
    </div>
  );
};

export default FormInput;
