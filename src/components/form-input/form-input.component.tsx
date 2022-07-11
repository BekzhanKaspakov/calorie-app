import "./form-input.styles.scss";
type FormInputProps = {
  label: string;
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
