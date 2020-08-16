import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router";

import App from "./App";
import Login from "./components/Login";

test("check route login goes to login page", () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={["/login"]}>
      <App />
    </MemoryRouter>
  );
  expect(wrapper.find(Login)).toHaveLength(1);
});

test("check route / goes to login page", () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  expect(wrapper.find(Login)).toHaveLength(1);
});
