import { AddBubble, newBubble } from "./winBubbles";

describe("AddBubble", () => {
  const newBub = newBubble();

  it("Should add a bubble if the Array is empty", () => {
    const newArray = AddBubble([], newBub);

    expect(newArray).toHaveLength(1);
  });

  it("Should not add bubble if new bubble is too close", () => {
    const newArray = AddBubble([newBub], newBub);

    expect(newArray).toHaveLength(2);
  });

  it("Should add bubble if new bubble is far away", () => {
    const newArray = AddBubble([{ x: 0, y: 0 }], { x: 0, y: 62 });

    expect(newArray).toHaveLength(2);
  });

  it.skip("Should not add bubble in-between bubbles of safe distance", () => {
    const newArray = AddBubble(
      [
        { x: 0, y: 0 },
        { x: 0, y: 31 },
      ],
      { x: 0, y: 15 },
    );

    expect(newArray).toHaveLength(2);
  });
});
