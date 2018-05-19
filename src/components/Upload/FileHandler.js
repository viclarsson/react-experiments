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
    console.log(this.props);
    const { uploadHandler, uploadStatus, upload, droppable } = this.props;
    console.log(uploadStatus);
    const classes = classnames(
      "flex flex-column items-center justify-center pa5 ba b--dashed bw1 br2 moon-gray b--light-gray",
      {
        "grow b--washed-green green": droppable.canDrop
      }
    );
    return (
      <div className={classes}>
        {!upload.hasFiles && (
          <div className="grow pointer" onClick={upload.add}>
            Pick or drag files here!
          </div>
        )}
        {uploadStatus !== "idle" && <div>{uploadStatus}</div>}
        {upload.hasFiles && (
          <div className="tc">
            {upload.files.map((file, i) => (
              <div key={i} className="tl flex items-center mv2">
                <img
                  className="flex-none w-20 br2"
                  src={upload.previews[file.id]}
                  alt="Preview before upload"
                />
                <div className="w-100 pl2 f7 gray">
                  <p className="ma0">
                    {file.name}, {file.size}, {file.type}
                  </p>
                  <a
                    onClick={e => {
                      upload.delete(file.id);
                    }}
                    className="red fw7"
                  >
                    Delete
                  </a>
                </div>
              </div>
            ))}
            <div onClick={upload.add} className={BLUE_BUTTON}>
              + Add files
            </div>
            <div
              onClick={() => uploadHandler(upload.fileList)}
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

class FileHandlerWrapper extends Component {
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
        render={state => {
          return (
            <Droppable
              accepts={[Types.FILE, ...accept]}
              onDrop={this.handleDrop(state.processFiles)}
              render={props => {
                return (
                  <div>
                    <FileHandler
                      uploadHandler={uploadHandler}
                      uploadStatus={uploadStatus}
                      upload={state}
                      droppable={props}
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

export default withFileUpload(FileHandlerWrapper);
