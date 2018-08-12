import React, { Fragment, PureComponent } from "react";

// Form
import Form, { formElement } from "../react-form/Form";

// Mock functions
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function max(limit) {
  return value => {
    return value.length <= limit;
  };
}

const InputComponent = ({
  type,
  value,
  id,
  validators,
  onChange,
  validation
}) => (
  <Fragment>
    <input
      type={type}
      value={value}
      id={id}
      onChange={onChange}
      validators={validators}
    />
    {JSON.stringify(validation)}
  </Fragment>
);

const CheckedInputComponent = ({
  type,
  checked,
  id,
  validators,
  onChange,
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
    {JSON.stringify(validation)}
  </Fragment>
);

const Input = formElement(InputComponent, "value");
const Checkbox = formElement(CheckedInputComponent, "checked");

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
          onSubmit={validation => e => {
            e.preventDefault();
            console.log("Submit", validation);
          }}
        >
          {validation => (
            <Fragment>
              {JSON.stringify(validation)}
              <Input
                type="text"
                value={text}
                id="input-text"
                onChange={e => this.setState({ text: e.target.value })}
                maxLength={10}
                validators={[max(10)]}
              />

              <Input
                type="email"
                value={email}
                id="input-email"
                onChange={e => this.setState({ email: e.target.value })}
                validators={[max(10), validateEmail]}
              />
              <Checkbox
                type="checkbox"
                checked={checkbox}
                id="input-checkbox"
                onChange={e => this.setState({ checkbox: e.target.checked })}
                validators={[
                  (checked, _, values) => {
                    return (
                      values["input-email"].value === "vic@vic.se" && checked
                    );
                  }
                ]}
              />
              <button type="submit">Submit</button>
            </Fragment>
          )}
        </Form>

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
            validators={[max(10)]}
          />

          <Input
            type="email2"
            value={email2}
            id="input-email2"
            onChange={e => this.setState({ email2: e.target.value })}
            validators={[validateEmail]}
          />
          <button type="submit">Submit</button>
        </Form>
      </Fragment>
    );
  }
}

export default FormRoute;
