import * as React from "react";
import { connect } from "react-redux";
import { Dialog } from "../../../../components";

class Component extends React.PureComponent {
  public render() {
    return <Dialog title="Profile" />;
  }
}

export const Profile = connect()(Component);
