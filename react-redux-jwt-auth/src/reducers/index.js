import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import todos from "./todo";
import socketInfo from "./socket";
import calender from "./calender"
import meeting from "./meeting"
import hr from "./hr"
import payslip from "./payslip"


export default combineReducers({
  auth,
  message,
  todos,
  socketInfo,
  calender,
  meeting,
  hr,
  payslip
});
