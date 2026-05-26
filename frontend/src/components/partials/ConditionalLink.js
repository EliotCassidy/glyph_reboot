import { Link } from "react-router-dom";

function ConditionalLink({ children, to, condition }) {
  return !!condition && to ? <Link to={to}>{children}</Link> : <>{children}</>;
}

export default ConditionalLink;
