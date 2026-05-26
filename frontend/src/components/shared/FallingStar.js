import styled, { keyframes } from "styled-components";

import StarImg from "../../assets/ic_star.svg";

function FallingStar({ x, y }) {
  const fall = keyframes`
    from { 
      top: -${y + 10}%;
    }
    to { 
      top:  ${y + 110}%;
    }
`;

  const Star = styled.img`
    left: ${x}%;
    top: -${y + 10}%;
    animation: ${fall} 7s ease;
    position: absolute;
  `;

  return <Star alt="" src={StarImg} />;
}

export default FallingStar;
