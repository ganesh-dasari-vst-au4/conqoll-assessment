import React, { Fragment } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import "./App.css";
import { Button, Modal } from "antd";
import { connect } from "react-redux";
import All from "./Components/All";
import ShortListed from "./Components/ShortListed";

class App extends React.Component {
  state = {
    visible: false,
    City: "",
    State: "",
    District: "",
  };

  componentDidMount = async () => {
    fetch("https://api.jsonbin.io/b/5f6f36127243cd7e824413e1")
      .then((res) => res.json())
      .then(async (data) => {
        await data.forEach((elem, index) => {
          elem.key = index;
        });
        this.props.dispatch({ type: "start", payload: data });
      });
  };

  handleOk = async (e) => {
    let newData = {
      City: this.state.City,
      State: this.state.State,
      District: this.state.District,
      key: this.props.all.length,
    };

    await this.props.dispatch({ type: "create", payload: newData });

    this.handleCancel();
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      City: "",
      State: "",
      District: "",
    });
  };

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    return (
      <Fragment>
        <div className="app">
          <div className="container-fluid p-0">
            {" "}
            <BrowserRouter>
              <header className="mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100vw"
                  height="120"
                >
                  <g fill="#63BABA" fill-rule="evenodd">
                    <path d="M470.577 563.429c-51.432-51.425-51.438-134.806-.013-186.237l.013-.013L867.235-19.424c51.441-51.434 134.836-51.434 186.276 0 48.811 48.804 51.304 126.392 7.473 178.135l178.158-178.135c51.441-51.434 134.836-51.434 186.277 0 51.431 51.424 51.437 134.805.013 186.237-.005.004-.01.008-.013.013l-396.66 396.603c-51.44 51.433-134.834 51.433-186.275 0-48.812-48.805-51.304-126.394-7.471-178.138L656.853 563.43c-51.441 51.433-134.836 51.433-186.276 0zM342.268 45.605c-51.432-51.425-51.438-134.806-.013-186.237l.013-.013 396.658-396.603c51.441-51.434 134.836-51.434 186.277 0 51.431 51.424 51.437 134.805.013 186.237-.005.004-.01.008-.013.013L528.543 45.605c-51.44 51.433-134.834 51.433-186.275 0zm-444.692 71.824c-51.432-51.424-51.438-134.806-.013-186.237l.013-.013 396.658-396.603c51.441-51.434 134.836-51.434 186.277 0 51.431 51.424 51.437 134.805.013 186.237a80.86 80.86 0 01-.013.013L83.85 117.429c-51.44 51.433-134.834 51.433-186.275 0z" />
                  </g>
                </svg>
                <div className="d-flex justify-content-between menu px-3">
                  <div>
                    <h1>Welcome</h1>
                  </div>
                  <div>
                    <Link to="/">
                      {" "}
                      <Button id="send" style={{ marginRight: "1.5rem" }}>
                        All
                      </Button>
                    </Link>
                    <Link to="/shortlist">
                      <Button id="send" style={{ marginRight: "1.5rem" }}>
                        Shortlist
                      </Button>
                    </Link>
                    <Button
                      id="send"
                      onClick={() => {
                        this.setState({ visible: true });
                      }}
                    >
                      Create New
                    </Button>
                  </div>
                </div>
              </header>

              <Switch>
                <Route exact path="/" component={All} />
                <Route path="/shortlist" component={ShortListed} />
              </Switch>
            </BrowserRouter>
          </div>
        </div>

        <Modal
          title="Create New"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={[
            <button className="btn btn-danger" onClick={this.handleCancel}>
              Cancel
            </button>,
            <Button
              id="send"
              disabled={
                !this.state.City || !this.state.State || !this.state.District
                  ? true
                  : false
              }
              onClick={this.handleOk}
            >
              Create
            </Button>,
          ]}
        >
          <div className="d-flex flex-column">
            <input
              className="form-control mb-4"
              value={this.state.City}
              name="City"
              placeholder="City*"
              onChange={this.handleInput}
            />
            <input
              className="form-control mb-4"
              value={this.state.State}
              name="State"
              placeholder="State*"
              onChange={this.handleInput}
            />
            <input
              className="form-control"
              value={this.state.District}
              name="District"
              placeholder="District*"
              onChange={this.handleInput}
            />
          </div>
        </Modal>
      </Fragment>
    );
  }
}

const fromReducer = (state) => {
  return { all: state.all };
};

export default connect(fromReducer)(App);
