import React, { Component } from "react";
import classnames from "classnames";

import Files from "../react-files/Files";
import Droppable, { Types } from "../react-dnd/Droppable";

class Uploader extends Component {
  render() {
    const { upload, droppable } = this.props;
    const classes = classnames(
      "flex flex-column items-center justify-center pa5 ba br2 silver b--silver bg-near-white",
      {
        "bg-green white": droppable.canDrop && droppable.isOver
      }
    );
    return (
      <div className={classes}>
        <div onClick={upload.open}>Pick or drag files here!</div>
        {upload.fileList && (
          <div>
            {upload.files.map((file, i) => (
              <div key={i} className="flex items-center mv2">
                <img
                  className="flex-none w-20 br2"
                  src={upload.previews[file.id]}
                  alt="Preview image before upload"
                />
                <div className="w-100 pl2 f7 gray">
                  <p className="ma0">{file.name}, {file.size}, {file.type}</p>
                  <a onClick={() => upload.delete(file.id)} className="red fw7">Delete</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

class UploaderWrapper extends Component {
  handleDrop(processFunction) {
    return monitor => {
      const files = monitor.getItem().files;
      processFunction(files);
      return {};
    };
  }

  render() {
    return (
      <Files
        multiple={true}
        handleChange={files =>
          console.log("We have files! Maybe open cropper?", files)
        }
        render={state => {
          return (
            <Droppable
              accepts={[Types.FILE]}
              onDrop={this.handleDrop(state.processFiles)}
              render={props => {
                return (
                  <div>
                    <Uploader upload={state} droppable={props} />
                  </div>
                );
              }}
            />
          );
        }}
      />
    );
  }
}

export default UploaderWrapper;
