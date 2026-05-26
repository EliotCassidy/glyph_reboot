const initallyStarPosition = [
  { x: 57, y: 49 },
  { x: 135, y: 133 },
  { x: 257, y: 90 },
  { x: 598, y: 177 },
  { x: 113, y: 360 },
  { x: 72, y: 455 },
  { x: 245, y: 700 },
  { x: 119, y: 749 },
  { x: 196, y: 823 },
  { x: 981, y: 134 },
  { x: 1113, y: 56 },
  { x: 1117, y: 220 },
  { x: 1274, y: 216 },
  { x: 1107, y: 336 },
  { x: 1066, y: 697 },
  { x: 1134, y: 676 },
  { x: 1223, y: 635 },
  { x: 1130, y: 764 },
];

const width = 1324;
const height = 911;

const starPositions = initallyStarPosition.map((star) => {
  return {
    x: Math.floor((star.x / width) * 100),
    y: Math.floor((star.y / height) * 100),
  };
});

export default starPositions;
