import { render } from "@testing-library/react";
import React from "react";

import Character from "./Character";

describe("Character", () => {
  it("should be pressed if isActive is true", () => {
    const { getByRole } = render(<Character isActive="true" item="&#70405;" />);

    expect(getByRole("button", { pressed: true })).toBeInTheDocument();
  });

  it("should not be pressed if isActive is false", () => {
    const { getByRole } = render(
      <Character isActive="false" item="&#70405;" />,
    );

    expect(getByRole("button", { pressed: false })).toBeInTheDocument();
  });

  it("should have active styles when pressed", () => {
    const { getByRole } = render(<Character isActive="true" item="&#70405;" />);

    expect(getByRole("button", { pressed: true })).toHaveClass(
      "border-indigo-500",
      "bg-indigo-300",
      "border-3",
    );
  });
});
