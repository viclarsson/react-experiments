import React, { Component } from "react";

// Api
import { postFormData } from "../../api/requests";

const withFileUpload = (C) => {
  class FileUpload extends Component {
    constructor(props) {
      super(props);
      this.uploadFiles = this.uploadFiles.bind(this);
    }

    uploadFiles(fileList) {
      const formData = new FormData();
      for (let i in fileList) {
        console.log(i);
        formData.append(`file_${i}`, fileList[i]);
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
      return (
        <C {...this.props} uploadHandler={this.uploadFiles} />
      );
    }
  }
  return FileUpload;
}

export default withFileUpload;
