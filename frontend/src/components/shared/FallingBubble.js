import styled, { keyframes } from "styled-components";

function FallingBubble({ x, y }) {
  const fall = keyframes`
    from { 
      top: -${y + 10}%;
    }
    to { 
      top:  ${y + 110}%;
    }
`;

  const Circle = styled.span`
    left: ${x}%;
    top: -${y + 10}%;
    animation: ${fall} 7s ease;
    position: absolute;
  `;

  return <Circle className="rounded-full h-6 w-6 bg-primary" />;
}

export default FallingBubble;
