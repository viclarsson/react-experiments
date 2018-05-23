import React, { Fragment, PureComponent } from "react";

const HIDE = {
  opacity: 0,
  position: "fixed",
  top: "-9999px",
  left: "-9999px"
};

export default class Files extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileList: {},
      files: [],
      hasFiles: false,
      previews: {}
    };

    this.fileList = {};
    this.files = [];

    this.setRef = this.setRef.bind(this);
    this.add = this.add.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.processFiles = this.processFiles.bind(this);
    this.delete = this.delete.bind(this);
    this.reset = this.reset.bind(this);
    this.update = this.update.bind(this);
  }

  setRef(r) {
    this.input = r;
  }

  createPreviews() {
    const files = this.fileList;
    const fileKeys = Object.keys(files);
    return new Promise(function(resolve, reject) {
      let previews = {};
      fileKeys.forEach(id => {
        const file = files[id];
        if (!file.type.match("image")) {
          previews[id] = null;
          return;
        }
        const reader = new FileReader();
        reader.addEventListener("load", e => {
          previews[id] = e.target.result;
          if (Object.keys(previews).length === fileKeys.length) {
            resolve(previews);
          }
        });
        reader.readAsDataURL(file);
      });
    });
  }

  handleChange(e) {
    this.processFiles(null);
  }

  processFiles(fileArray) {
    const { accept } = this.props;
    const temp = fileArray || this.input.files;
    const tempKeys = Object.keys(temp);
    tempKeys.forEach(i => {
      if (accept.indexOf(temp[i].type) === -1) return;
      const uniqueId =
        "_" +
        Math.random()
          .toString(36)
          .substr(2, 9);
      this.fileList[uniqueId] = temp[i];
      this.files.push({
        id: uniqueId,
        name: temp[i].name,
        size: temp[i].size,
        type: temp[i].type
      });
    });
    this.createPreviews().then(previews =>
      this.setState({
        previews: previews
      })
    );
    this.update();
  }

  update() {
    const { handleChange } = this.props;
    this.setState({
      fileList: { ...this.fileList },
      files: [...this.files],
      hasFiles: this.files[0] ? true : false
    });
    if (handleChange) handleChange(this.files);
  }

  delete(id) {
    delete this.fileList[id];
    this.files = this.files.filter(f => f.id !== id);
    this.update();
  }

  reset() {
    this.fileList = {};
    this.files = [];
    this.update();
  }

  add() {
    this.input.click();
  }

  render() {
    const { render, accept, multiple } = this.props;
    return (
      <Fragment>
        <input
          style={HIDE}
          multiple={multiple}
          accept={accept}
          type="file"
          ref={this.setRef}
          onChange={this.handleChange}
        />
        {render({
          ...this.state,
          add: this.add,
          processFiles: this.processFiles,
          delete: this.delete,
          reset: this.reset
        })}
      </Fragment>
    );
  }
}
