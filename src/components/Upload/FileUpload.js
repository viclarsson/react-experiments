import React, { Component } from "react";

// Api
import { postFormData } from "../../api/requests";

const withFileUpload = (C) => {
  class FileUpload extends Component {
    constructor(props) {
      super(props);
      this.state = {
        status: 'idle'
      };
      this.uploadFiles = this.uploadFiles.bind(this);
    }

    uploadFiles(fileList) {
      this.setState({
        status: 'uploading'
      });
      const formData = new FormData();
      for (let i in fileList) {
        formData.append(`file_${i}`, fileList[i]);
      }
      postFormData(formData)
        .then(res => {
          this.setState({
            status: 'done'
          });
        })
        .catch(err => {
          this.setState({
            status: 'error'
          });
        });
    }

    render() {
      const { status } = this.state;
      return (
        <C {...this.props} uploadStatus={status} uploadHandler={this.uploadFiles}/>
      );
    }
  }
  return FileUpload;
}

export default withFileUpload;
