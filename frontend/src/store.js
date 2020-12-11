import { persist, createStore, action } from "easy-peasy";

const model = {
  apollotoken: undefined,
  roles: [],
  user_id: undefined,
  profile_pic: null,
  addToken: action((state, payload) => {
    state.apollotoken = payload;
  }),
  addId: action((state, payload) => {
    state.user_id = payload;
  }),
  deleteToken: action((state) => {
    state.apollotoken = undefined;
    state.roles = [];
  }),
  addRoles: action((state, payload) => {
    state.roles = payload;
    console.log("Roles in store: " + state.roles);
    console.log("Roles type in store: " + typeof state.roles);
  }),
  addProfilePic: action((state, payload) => {
    state.profile_pic = payload;
  }),
};

export const store = createStore(
  persist(model, {
    storage: "localStorage",
  })
);
