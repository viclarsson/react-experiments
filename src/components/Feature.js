import React, { PureComponent } from "react";

class Feature extends PureComponent {
  render() {
    const { show, children, className } = this.props;
    return (
      show ? (
        <div className="relative">
          <div className="fixed absolute--fill o-50 bg-black z-1" />
          <div className="relative z-2 flex items-center justify-center">
            <div className={`z-1 absolute bg-white w-100 h-100 content-box ${className}`} style={{ boxSizing: 'content-box' }} />
            <div className="z-2 relative">{children}</div>
          </div>
        </div>
      ) : children
    );
  }
}

export default Feature;
