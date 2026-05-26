function getDistance(x1, y1, x2, y2) {
  var xs = x2 - x1,
    ys = y2 - y1;

  xs *= xs;
  ys *= ys;

  return Math.sqrt(xs + ys);
}

export function newBubble() {
  return {
    x: Math.round(Math.random() * 100),
    y: Math.round(Math.random() * 100),
  };
}

function isOverlapping(array, currentBubble) {
  return array.every((bub) => {
    var distance = Math.round(
      getDistance(currentBubble.x, currentBubble.y, bub.x, bub.y),
    );
    return distance < 30;
  });
}

export function AddBubble(array, currentBubble) {
  const isOver = isOverlapping(array, currentBubble);
  if (array.length > 0 && isOver) {
    return AddBubble(array, newBubble());
  }

  return [...array, currentBubble];
}

function winBubbles() {
  return Array.from(new Array(15))
    .fill("")
    .reduce((acc, currentValue, currentIndex, array) => {
      const bubble = newBubble();

      return AddBubble(acc, bubble);
    }, []);
}

export default winBubbles;
