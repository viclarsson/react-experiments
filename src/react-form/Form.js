import * as React from "react";
const Context = React.createContext();

class FormProvider extends React.PureComponent {
  values = {};
  validation = {};
  componentProps = {};

  validate = (value, id, validators, props) => {
    let boolean = true;
    console.log("Will validate", id);
    for (const i in validators) {
      boolean = validators[i](value, props, this.values) ? boolean : false;
    }
    this.validation[id] = {
      valid: boolean,
      dirty: this.values[id].dirty
    };
    this.setState({ validation: { ...this.validation } });
    return boolean;
  };

  validateAll = () => {
    let valid = true;
    for (const id in this.state.components) {
      valid = this.validate(
        this.values[id].value,
        id,
        this.state.components[id],
        this.componentProps[id]
      )
        ? valid
        : false;
    }
    return valid;
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
    if (initial || realtime) {
      this.validate(value, id, this.state.components[id], props);
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
            onSubmit(validateAll())(e);
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
