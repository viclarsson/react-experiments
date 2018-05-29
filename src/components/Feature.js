import React, { PureComponent } from "react";
import { Keyframes, animated } from "react-spring";

const Background = Keyframes.Spring({
  open: {
    to: { opacity: 0.5 }
  },
  closed: {
    to: { opacity: 0 }
  }
});

const Container = Keyframes.Spring({
  open: {
    to: { opacity: 1 }
  },
  closed: {
    to: { opacity: 0 }
  }
});

const Heart = Keyframes.Spring({
  open: {
    to: { opacity: 1, y: -120 }
  },
  closed: {
    to: { opacity: 0, y: 0 }
  }
});

class Feature extends PureComponent {
  render() {
    const { show, children, className } = this.props;
    const state = show ? "open" : "closed";
    return (
      <div className="relative">
        <Background state={state}>
          {style => (
            <div
              className="fixed absolute--fill o-50 bg-navy z-1"
              style={{ ...style, pointerEvents: show ? "all" : "none" }}
            />
          )}
        </Background>
        <div className="relative z-2 flex items-center justify-center">
          <Heart native state={state} config={{ tension: 200, friction: 8 }}>
            {({ y, opacity }) => (
              <animated.div
                className="absolute"
                style={{
                  height: 100,
                  width: 100,
                  opacity: opacity.interpolate(o => o),
                  transform: y.interpolate(y => `translate3d(0,${y}px,0)`)
                }}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/42/Love_Heart_SVG.svg"
                  alt="Heart"
                />
              </animated.div>
            )}
          </Heart>
          <Container state={state}>
            {style => (
              <div
                className={`z-1 absolute bg-white w-100 h-100 content-box ${className}`}
                style={{
                  ...style,
                  pointerEvents: show ? "all" : "none",
                  boxSizing: "content-box"
                }}
              />
            )}
          </Container>
          <div className="z-2 relative">{children}</div>
        </div>
      </div>
    );
  }
}

export default Feature;
