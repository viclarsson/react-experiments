import { Component } from "react";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// Actions
import * as NotificationActions from "../react-notification/NotificationActions";

class Network extends Component {
  constructor(props) {
    super(props);
    this.updateStatus = this.updateStatus.bind(this);
  }
  shouldComponentUpdate() {
    return false;
  }
  componentDidMount() {
    window.addEventListener("online", this.updateStatus);
    window.addEventListener("offline", this.updateStatus);
  }
  componentWillUnmount() {
    window.removeEventListener("online", this.updateStatus);
    window.removeEventListener("offline", this.updateStatus);
  }
  updateStatus(e) {
    const { registerNotification, removeNotification } = this.props;
    switch (e.type) {
      case "offline":
        registerNotification("error", {
          id: "network-status",
          content: "Bro, you are offline."
        });
        break;
      case "online":
        removeNotification("error", "network-status");
        break;
      default:
    }
  }
  render() {
    return null;
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      registerNotification: NotificationActions.registerNotification,
      removeNotification: NotificationActions.removeNotification
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(Network);
