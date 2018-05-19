import React, { Component } from "react";
import classnames from "classnames";

// Components
import Files from "../../react-files/Files";
import Droppable, { Types } from "../../react-dnd/Droppable";

// HOC
import withFileUpload from "./FileUpload";

// Tachyons style
import { BLUE_BUTTON } from "../../tachyons";

class FileHandler extends Component {

  componentWillReceiveProps (nextProps) {
    const { uploadStatus, upload: { reset } } = this.props;
    // Reset the data when uploaded!
    if (uploadStatus === 'uploading' && nextProps.uploadStatus === 'done') {
      reset();
    }
  }

  render() {
    const { uploadHandler, uploadStatus, files, droppable } = this.props;
    const classes = classnames(
      "flex flex-column items-center justify-center pa5 ba b--dashed bw1 br2 moon-gray b--light-gray",
      {
        "grow b--washed-green green": droppable.canDrop
      }
    );
    return (
      <div className={classes}>
        {!files.hasFiles && (
          <div className="grow pointer" onClick={files.add}>
            Pick or drag files here!
          </div>
        )}
        {uploadStatus !== "idle" && <div>{uploadStatus}</div>}
        {files.hasFiles && (
          <div className="tc">
            {files.files.map((file, i) => (
              <div key={i} className="tl flex items-center mv2">
                <img
                  className="flex-none w-20 br2"
                  src={files.previews[file.id]}
                  alt="Preview before upload"
                />
                <div className="w-100 pl2 f7 gray">
                  <p className="ma0">
                    {file.name}, {file.size}, {file.type}
                  </p>
                  <a
                    onClick={e => {
                      files.delete(file.id);
                    }}
                    className="red fw7"
                  >
                    Delete
                  </a>
                </div>
              </div>
            ))}
            <div onClick={files.add} className={BLUE_BUTTON}>
              + Add files
            </div>
            <div
              onClick={() => uploadHandler(files.fileList)}
              className={BLUE_BUTTON}
            >
              Upload
            </div>
          </div>
        )}
      </div>
    );
  }
}

class FileDropHandler extends Component {
  handleDrop(processFunction) {
    const { accept } = this.props;
    return monitor => {
      const files = monitor
        .getItem()
        .files.filter(f => accept.includes(f.type));
      if (files.length > 0) {
        processFunction(files);
      }
      return {};
    };
  }

  render() {
    const { accept, uploadHandler, uploadStatus } = this.props;
    return (
      <Files
        accept={accept}
        multiple={true}
        handleChange={files =>
          console.log("File change! Maybe open cropper?", files)
        }
        render={files => {
          return (
            <Droppable
              accepts={[Types.FILE, ...accept]}
              onDrop={this.handleDrop(files.processFiles)}
              render={droppable => {
                return (
                  <div>
                    <FileHandler
                      uploadHandler={uploadHandler}
                      uploadStatus={uploadStatus}
                      files={files}
                      droppable={droppable}
                    />
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

export default withFileUpload(FileDropHandler);
