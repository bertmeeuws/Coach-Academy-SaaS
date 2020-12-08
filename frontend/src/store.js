import { persist, createStore, action } from "easy-peasy";

const model = {
  apollotoken: undefined,
  roles: [],
  user_id: undefined,
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
};

export const store = createStore(
  persist(model, {
    storage: "localStorage",
  })
);
