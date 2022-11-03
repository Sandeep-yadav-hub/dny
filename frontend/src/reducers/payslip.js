const initialState = {
    template:[],
    config:[]
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
      case "SETPAYSLIPTEMPLATES":
        return { ...state, template:payload.data};
      default:
        return state;
    }
  }
  