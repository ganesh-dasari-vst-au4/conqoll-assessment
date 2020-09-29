import React, { Component, Fragment } from "react";
import { Table, Input, Space, Button, Popconfirm } from "antd";
import { connect } from "react-redux";

import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

class All extends React.Component {
  state = {
    searchText: "",
    searchedColumn: "",
  };

  //   componentDidMount = async () => {
  //     await this.setState({ data: this.props.all }, () => {
  //       console.log(this.state.data, "sdsdsd");
  //     });
  //     console.log(this.props.state, "sdsdsd");
  //   };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  handleSortList = async (obj) => {
    let short = obj;
    let checker = false;
    if (this.props.shortlisted[0]) {
      await this.props.shortlisted.map((elem) => {
        if (elem.key === short.key) return (checker = true);
      });
      if (checker === false) {
        this.props.dispatch({ type: "shortlist", payload: short });
      }
    } else {
      this.props.dispatch({ type: "shortlist", payload: short });
    }
  };

  handleDelete = async (key) => {
    let all = this.props.all;
    let short = this.props.shortlisted;
    let newAll = await all.filter((elem) => elem.key !== key);
    let newShort = await short.filter((elem) => elem.key !== key);
    this.props.dispatch({
      type: "deleteAll",
      payload: { all: newAll, short: newShort },
    });
  };
  render() {
    const column = [
      {
        title: "City",
        dataIndex: "City",
        sorter: (a, b) => {
          return ("" + a.City).localeCompare(b.City);
        },
        sortDirections: ["descend", "ascend"],

        ...this.getColumnSearchProps("City"),
      },
      {
        title: "State",
        dataIndex: "State",
        sorter: (a, b) => {
          return ("" + a.State).localeCompare(b.State);
        },
        sortDirections: ["descend", "ascend"],

        ...this.getColumnSearchProps("State"),
      },
      {
        title: "District",
        dataIndex: "District",
        sorter: (a, b) => {
          return ("" + a.District).localeCompare(b.District);
        },
        sortDirections: ["descend", "ascend"],

        ...this.getColumnSearchProps("District"),
      },
      {
        title: "Actions",
        dataIndex: "",
        // method which conditionally render buttons for save , reset and delete data
        render: (text, result) => {
          return (
            <Space direction="horizontal">
              <button
                className="btn btn-warning"
                onClick={() => {
                  this.handleSortList(result);
                }}
              >
                Shortlist
              </button>

              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(result.key)}
              >
                <button className="btn btn-danger">Delete</button>
              </Popconfirm>
            </Space>
          );
        },
      },
    ];

    return (
      <Fragment>
        <div className="container">
          {this.props.all[0] && (
            <Table columns={column} dataSource={this.props.all} />
          )}
        </div>
      </Fragment>
    );
  }
}

const fromReducer = (state) => {
  return { all: state.all, shortlisted: state.shortlisted };
};

export default connect(fromReducer)(All);
