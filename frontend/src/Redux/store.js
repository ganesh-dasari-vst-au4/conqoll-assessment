import { connect } from "react-redux";
import { createStore } from "redux";

const inState = {
  all: [],
  shortlisted: [],
};

const appReducer = (state = inState, action) => {
  let copy = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case "start":
      copy.all = action.payload;
      console.log(copy.all, "start");
      return copy;

    case "shortlist":
      copy.shortlisted.push(action.payload);
      console.log(copy.shortlisted, "short");
      return copy;

    case "deleteAll":
      copy.all = action.payload.all;
      copy.shortlisted = action.payload.short;
      return copy;

    case "deleteShort":
      copy.shortlisted = action.payload;
      return copy;

    case "create":
      copy.all.push(action.payload);
      return copy;

    default:
      return copy;
  }
};

const store = createStore(appReducer);

export default store;
