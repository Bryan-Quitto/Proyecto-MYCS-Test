
import LogoIcon from '/src/assets/images/logos/acadexus-icono.jpg';
import { Link } from 'react-router';

const Logo = () => {
  return (
   <Link to={'/'}>
        <img src={LogoIcon} alt="logo" width="40" />      
    </Link>
  )
}

export default Logo