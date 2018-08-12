import * as React from "react";
const Context = React.createContext();

class FormProvider extends React.PureComponent {
  values = {};
  validation = {};
  componentProps = {};

  validate = (value, id, validators, props, submit = false) => {
    let result = {
      valid: true,
      messages: []
    };
    console.log("Will validate", id);
    for (const i in validators) {
      const { valid, message } = validators[i](value, props, this.values);
      if (!valid) {
        result.valid = false;
        result.messages.push(message);
      }
    }
    this.validation[id] = {
      valid: result.valid,
      messages: result.messages,
      dirty: this.values[id].dirty,
      submitted: submit
    };
    // Should be a shallow compare before setState to prevent an unnessessary render
    this.setState({ validation: { ...this.validation } });
    return this.validation[id];
  };

  validateAll = (submit = false) => {
    let submittable = true;
    for (const id in this.state.components) {
      const { valid } = this.validate(
        this.values[id].value,
        id,
        this.state.components[id],
        this.componentProps[id],
        submit
      );
      if (!valid) {
        submittable = false;
      }
    }
    return submittable;
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

  update = (id, value, props, initial, realtime) => {
    this.values = {
      ...this.values,
      [id]: {
        value,
        dirty: !initial
      }
    };
    this.componentProps[id] = props;
    if (initial) {
      this.validate(value, id, this.state.components[id], props);
    } else {
      this.validateAll(false);
    }
  };

  state = {
    components: {},
    validateAll: this.validateAll,
    validation: {},
    register: this.register,
    unregister: this.unregister,
    update: this.update
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
      false,
      this.props.realtime
    );
  }
  componentWillUnmount() {
    this.props.unregister(this.props.id);
  }
  render() {
    return null;
  }
}

export function formElement(C, validationPropName = "value", realtime = true) {
  const FormElement = props => {
    return (
      <Context.Consumer>
        {({ register, unregister, update, validation }) => {
          return (
            <React.Fragment>
              <FormControl
                realtime={realtime}
                register={register}
                unregister={unregister}
                update={update}
                id={props.id}
                validators={props.validators}
                componentProps={props}
                value={props[validationPropName]}
              />
              <C {...props} validation={validation[props.id]} />
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
      {({ validation, validateAll }) => (
        <form
          onSubmit={e => {
            onSubmit(validateAll(true))(e);
          }}
          noValidate
        >
          {children instanceof Function ? children(validation) : children}
        </form>
      )}
    </Context.Consumer>
  </FormProvider>
);

export default Form;
