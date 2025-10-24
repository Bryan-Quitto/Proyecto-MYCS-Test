import Logo from "/src/assets/images/logos/acadexus.jpg";
import { Link } from "react-router";

const FullLogo = () => {
  return (
    <Link to={"/"}>
      <img src={Logo} alt="logo" className="block" width="130" />
    </Link>
  );
};

export default FullLogo;