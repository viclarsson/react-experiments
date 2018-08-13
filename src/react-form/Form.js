import * as React from "react";
const Context = React.createContext();

class FormProvider extends React.PureComponent {
  values = {};
  componentProps = {};

  validate = (value, id, validators, props, submit) => {
    let result = {
      valid: true,
      messages: []
    };
    for (const i in validators) {
      const { valid, message } = validators[i](value, props, this.values);
      if (!valid) {
        result.valid = false;
        result.messages.push(message);
      }
    }
    const validation = {
      valid: result.valid,
      messages: result.messages,
      dirty: this.values[id].dirty,
      submitted: submit
    };
    // Should be a shallow compare before setState to prevent an unnessessary render
    this.setState(state => {
      return { validation: { ...state.validation, [id]: validation } };
    });
    return validation;
  };

  validateAll = (submit = false) => {
    let isFormValid = true;
    for (const id in this.state.components) {
      const { valid } = this.validate(
        this.values[id].value,
        id,
        this.state.components[id],
        this.componentProps[id],
        submit
      );
      if (!valid) {
        isFormValid = false;
      }
    }
    return isFormValid;
  };

  register = (id, defaultValue, validators, props) => {
    this.setState(
      state => {
        return {
          components: {
            ...state.components,
            [id]: validators
          }
        };
      },
      () => this.update(id, defaultValue, props, true)
    );
  };

  unregister = id => {
    this.setState(
      state => {
        return { components: { ...state.components, [id]: undefined } };
      },
      () => {
        this.componentProps[id] = undefined;
      }
    );
  };

  update = (id, value, props, validate = false, initial = false) => {
    this.values = {
      ...this.values,
      [id]: {
        value,
        dirty: !initial
      }
    };
    this.componentProps[id] = props;
    if (initial || validate) {
      this.validate(value, id, this.state.components[id], props);
    }
  };

  submit = () => {
    const valid = this.validateAll(true);
    this.setState(state => ({
      form: { submitted: true, valid }
    }));
    return valid;
  };

  onBlur = props => e => {
    if (props.onBlur) props.onBlur(e, this.validateAll());
  };

  state = {
    components: {},
    form: {
      submitted: false,
      valid: false
    },
    validation: {},
    register: this.register,
    unregister: this.unregister,
    update: this.update,
    onBlur: this.onBlur,
    validate: this.validate,
    validateAll: this.validateAll,
    submit: this.submit
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

class FormControl extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value;
  }
  componentDidMount() {
    this.props.register(
      this.props.id,
      this.props.value,
      this.props.validators,
      this.props.componentProps
    );
  }
  componentDidUpdate() {
    this.props.update(
      this.props.id,
      this.props.value,
      this.props.componentProps,
      this.props.validateOnUpdate
    );
  }
  componentWillUnmount() {
    this.props.unregister(this.props.id);
  }
  render() {
    return null;
  }
}

const defaultOptions = {
  validationPropName: "value",
  validateOnUpdate: false
};
export function formElement(C, elementOptions) {
  const options = { ...defaultOptions, ...elementOptions };
  const FormElement = props => {
    return (
      <Context.Consumer>
        {({
          register,
          unregister,
          update,
          validateAll,
          validation,
          onBlur,
          form
        }) => {
          const state = validation[props.id]
            ? validation[props.id]
            : {
                valid: false,
                dirty: false,
                messages: []
              };
          return (
            <React.Fragment>
              <FormControl
                validateOnUpdate={options.validateOnUpdate}
                register={register}
                unregister={unregister}
                update={update}
                id={props.id}
                validators={props.validators}
                componentProps={props}
                value={props[options.validationPropName]}
              />
              <C
                {...props}
                inputState={state}
                formState={form}
                onBlur={onBlur(props)}
              />
            </React.Fragment>
          );
        }}
      </Context.Consumer>
    );
  };
  return FormElement;
}

const Form = ({ onSubmit, children }) => (
  <FormProvider>
    <Context.Consumer>
      {({ form, validation, submit }) => (
        <form
          onSubmit={e => {
            onSubmit(submit())(e);
          }}
          noValidate
        >
          {children instanceof Function
            ? children({ form, validation })
            : children}
        </form>
      )}
    </Context.Consumer>
  </FormProvider>
);

export default Form;
