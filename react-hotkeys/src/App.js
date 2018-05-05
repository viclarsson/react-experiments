import React, { Fragment, PureComponent } from 'react';

// Hotkey
import HotkeyProvider from './react-hotkeys/HotkeyProvider';
import withHotkey from './react-hotkeys/HotkeyHelper';

// Components
import TestComponent from './TestComponent';
const HotkeyComponent = withHotkey(TestComponent);

if (process.env.NODE_ENV !== 'production') {
  // There are some updates that might be able to be fixed
  const {whyDidYouUpdate} = require('why-did-you-update');
  whyDidYouUpdate(React);
}

class App extends PureComponent {
  constructor (props) {
    super(props);

    // Could be in Redux
    this.state = {
      components: [],
      page: 'index',
      activeIndex: 0,
      expandActive: false
    }

    // Could be Redux Actions
    this.addComponent = this.addComponent.bind(this);
    this.removeComponent = this.removeComponent.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
    this.expand = this.expand.bind(this);
    this.contract = this.contract.bind(this);
  }

  next (e) {
    if (this.state.activeIndex === (this.state.components.length - 1)) return;
    e.preventDefault();
    this.setState({
      activeIndex: this.state.activeIndex + 1
    });
  }
  previous (e) {
    if (this.state.activeIndex === 0) return;
    e.preventDefault();
    this.setState({
      activeIndex: this.state.activeIndex - 1
    });
  }
  toggleExpand () {
    this.setState({
      expandActive: !this.state.expandActive
    });
  }
  expand () {
    this.setState({
      expandActive: true
    });
  }
  contract () {
    this.setState({
      expandActive: false
    });
  }
  addComponent () {
    this.setState({
      components: [...this.state.components, Math.random().toString(36).substring(7)]
    });
  }
  removeActive () {
    if (this.state.components.length === 0) return;
    const newArray = this.state.components.filter((v, i) => i !== this.state.activeIndex);
    this.setState({
      components: newArray
    });
  }
  removeComponent (value) {
    const newArray = this.state.components.filter(v => v !== value);
    this.setState({
      components: newArray
    });
  }

  render() {
    const { activeIndex } = this.state;
    return (
      <HotkeyProvider>
        <div className="center measure">
          { this.state.page === 'index' && (
            <Fragment>
              <h1>UI hotkeys</h1>
              <p>
                The idea is to create a system for handling UI hotkeys.
                Hotkeys makes an web application feel modern and responsive,
                but the handling and implementation must be scalable.
              </p>
              <p>
                Common scenarios:
              </p>
              <ul>
                <li>Escape to close</li>
                <li>Enter to proceed</li>
                <li>Custom key binding</li>
              </ul>
              <HotkeyComponent keyCode={39} handler={() => this.setState({ page: 'demo' })}>
                <a className="dib white bg-blue pa2" onClick={() => this.setState({ page: 'demo' })}>
                  Try! (or click right arrow)
                </a>
              </HotkeyComponent>
            </Fragment>
          )}
          { this.state.page === 'demo' && (
            <Fragment>
              <h1>Demo</h1>

              {/* Nagivation with hotkey */}
              <HotkeyComponent keyCode={37} handler={() => this.setState({ page: 'index' })}>
                <a className="blue" onClick={() => this.setState({ page: 'index' })}>
                  Back (or click left arrow)
                </a>
              </HotkeyComponent>

              <p>
                <HotkeyComponent keyCode={187} handler={() => this.addComponent()}>
                  <a className="dib white bg-blue pa2" onClick={() => this.addComponent()}>Add component (press +)</a>
                </HotkeyComponent>
              </p>
              <p className="gray f7 tc">(the active index has some bugs when removing/adding. No biggie, out of scope)</p>

              {this.state.components.map((c, i) => (
                <Fragment key={c}>
                  <div className={`pa2 br2 mb2 flex justify-between ${activeIndex === i ? 'bg-gray white' : 'bg-near-white gray'}`}>
                    <div className="flex-auto w-100">
                      Element: {c}
                      {this.state.expandActive && this.state.activeIndex === i && (
                        <div className="f7">
                          {/* Another hotkey for ENTER (13) */}
                          <HotkeyComponent keyCode={13} handler={() => alert(`Surprise! ${c}`)}>
                            <div>Try Enter for surprise!</div>
                          </HotkeyComponent>
                          <div>
                            Expandable dummy which adds a handler for ENTER. As it was mounted later, it gets priority.
                            This makes it possible to use different states to trigger different actions on the same keycode. Such wow.
                            Another example were to be to add a "remove" feature on focus. Just create a state for it and render the
                            HotkeyComponent.
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-none">
                      <a className="dib white bg-red pa1 br2 f7" onClick={() => this.removeComponent(c)}>Remove (Backspace)</a>
                    </div>
                  </div>
                </Fragment>
              ))}

              <div className="flex justify-around gray f7">
                {/* Hotkeys for list */}
                <HotkeyComponent keyCode={38} handler={(e) => this.previous(e)} />
                <HotkeyComponent keyCode={40} handler={(e) => this.next(e)} />
                <HotkeyComponent keyCode={8} handler={() => this.removeActive()} />
                <HotkeyComponent keyCode={84} handler={() => this.toggleExpand()}>
                  <div>Try T to toggle expand</div>
                </HotkeyComponent>
                <HotkeyComponent keyCode={13} handler={() => this.expand()}>
                  <div>Try Enter to expand</div>
                </HotkeyComponent>
                <HotkeyComponent keyCode={27} handler={() => this.contract()}>
                  <div>Try ESC to close again</div>
                </HotkeyComponent>
                <HotkeyComponent keyCode={32} handler={() => alert('Hi Space!')}>
                  <div>Try Space!</div>
                </HotkeyComponent>
              </div>
            </Fragment>
          )}
        </div>
      </HotkeyProvider>
    );
  }
}

export default App;
