import React, { Component } from "react";
import classnames from "classnames";

// Components
import Files from "../react-files/Files";
import Droppable, { Types } from "../react-dnd/Droppable";

// Api
import { postFormData } from "../api/requests";

// Tachyons style
import { BLUE_BUTTON } from "../tachyons";

class FileHandler extends Component {
  constructor(props) {
    super(props);
    this.uploadFiles = this.uploadFiles.bind(this);
  }

  uploadFiles() {
    const { upload } = this.props;
    const formData = new FormData();
    for (let i in upload.fileList) {
      console.log(i);
      formData.append(`file_${i}`, upload.fileList[i]);
    }
    postFormData(formData)
      .then(res => {
        console.log("Uploaded!", res);
      })
      .catch(err => {
        console.error("Error!", err);
      });
  }

  render() {
    const { upload, droppable } = this.props;
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
            <div onClick={this.uploadFiles} className={BLUE_BUTTON}>
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
    const { accept } = this.props;
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
                    <FileHandler upload={state} droppable={props} />
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

export default FileHandlerWrapper;
