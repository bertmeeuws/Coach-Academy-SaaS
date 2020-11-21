import { persist, createStore, action } from "easy-peasy";

const model = {
  todos: ["test", "hup"],
  apollotoken: undefined,
  roles: [],
  addToken: action((state, payload) => {
    state.apollotoken = payload;
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
