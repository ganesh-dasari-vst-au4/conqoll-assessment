import React, { Component, Fragment } from "react";
import { Table, Input, Space, Button, Popconfirm } from "antd";
import { connect } from "react-redux";

import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

class ShortListed extends React.Component {
  state = {
    searchText: "",
    searchedColumn: "",
    data: [],
  };

  componentDidMount = () => {
    this.setState({ data: this.props.shortlisted }, () => {
      console.log(this.state.data, "shorted");
    });
  };

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
  handleDelete = async (key) => {
    let short = this.props.shortlisted;
    let newShort = await short.filter((elem) => elem.key !== key);
    this.props.dispatch({
      type: "deleteShort",
      payload: newShort,
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
          {this.props.shortlisted[0] && (
            <Table columns={column} dataSource={this.props.shortlisted} />
          )}
        </div>
      </Fragment>
    );
  }
}

const fromReducer = (state) => {
  return { all: state.all, shortlisted: state.shortlisted };
};

export default connect(fromReducer)(ShortListed);
