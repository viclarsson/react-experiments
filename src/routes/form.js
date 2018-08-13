import React, { Fragment, PureComponent } from "react";

// Form
import Form, { formElement } from "../react-form/Form";

// Mock functions
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return {
    valid: re.test(String(email).toLowerCase()),
    message: "Not an email."
  };
}

function max(value, props) {
  return {
    valid: value.length <= props.maxLength,
    message: `Must be below ${props.maxLength} characters.`
  };
}

const InputComponent = ({
  type,
  value,
  id,
  validators,
  onChange,
  validation,
  formState,
  inputState,
  onBlur
}) => (
  <Fragment>
    <input
      type={type}
      value={value}
      id={id}
      onChange={onChange}
      validators={validators}
      onBlur={onBlur}
    />
    <br />
    {formState.submitted && inputState.messages.join(", ")}
  </Fragment>
);

const CheckedInputComponent = ({
  type,
  checked,
  id,
  validators,
  onChange,
  formState,
  inputState,
  validation
}) => (
  <Fragment>
    <input
      type={type}
      checked={checked}
      id={id}
      onChange={onChange}
      validators={validators}
    />
    <br />
    {formState.submitted && inputState.messages.join(", ")}
  </Fragment>
);

const Input = formElement(InputComponent, { validationPropName: "value" });
const Checkbox = formElement(CheckedInputComponent, {
  validationPropName: "checked",
  validateOnUpdate: true
});

// Build components

class FormRoute extends PureComponent {
  state = {
    text: "Hej",
    email: "Hej",
    checkbox: false,

    text2: "Hej2",
    email2: "Hej2"
  };

  render() {
    const { text, text2, email, email2, checkbox } = this.state;
    return (
      <Fragment>
        <Form
          onSubmit={valid => e => {
            e.preventDefault();
            console.log("Submit", valid);
          }}
        >
          {({ form, validation }) => (
            <Fragment>
              Form:
              <br />
              {JSON.stringify(form, validation)}
              <br />
              <br />
              Validation:
              <br />
              {JSON.stringify(validation)}
              <br />
              <br />
              <Input
                type="text"
                value={text}
                id="input-text"
                onChange={e => this.setState({ text: e.target.value })}
                maxLength={10}
                validators={[max]}
              />
              <br />
              <Input
                type="email"
                value={email}
                id="input-email"
                maxLength={10}
                onChange={e => this.setState({ email: e.target.value })}
                validators={[max, validateEmail]}
              />
              <br />
              <Checkbox
                type="checkbox"
                checked={checkbox}
                id="input-checkbox"
                onChange={e => this.setState({ checkbox: e.target.checked })}
                validators={[
                  (checked, _, values) => {
                    return {
                      valid:
                        values["input-email"].value === "vic@vic.se" && checked,
                      message:
                        'The email must be "vic@vic.se" and checkbox must be checked.'
                    };
                  }
                ]}
              />
              <br />
              <button type="submit">Submit</button>
            </Fragment>
          )}
        </Form>
        <br />
        <br />
        <Form
          onSubmit={validation => e => {
            e.preventDefault();
            console.log("Submit", validation);
          }}
        >
          <Input
            type="text2"
            value={text2}
            id="input-text2"
            onChange={e => this.setState({ text2: e.target.value })}
            maxLength={10}
            validators={[max]}
          />
          <br />
          <Input
            type="email2"
            value={email2}
            id="input-email2"
            onChange={e => this.setState({ email2: e.target.value })}
            validators={[validateEmail]}
          />
          <br />
          <button type="submit">Submit</button>
        </Form>
      </Fragment>
    );
  }
}

export default FormRoute;
