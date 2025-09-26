import { Link } from "react-router-dom";
import "./sidebarItem.css";

const SidebarItem = ({ Text, to, onClick }) => {
  return (
    <Link to={to} className="container" onClick={onClick}>
      {Text}
    </Link>
  );
};

export default SidebarItem;
