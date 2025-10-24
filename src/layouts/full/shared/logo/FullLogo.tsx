import Logo from "/src/assets/images/logos/fisei-icono.jpg";
import { Link } from "react-router";

const FullLogo = () => {
  return (
    <Link to={"/"}>
      <img src={Logo} alt="logo" className="block" width="170" />
    </Link>
  );
};

export default FullLogo;