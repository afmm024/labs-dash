// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'usuarios',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'categorias',
    path: '/dashboard/categories',
    icon: icon('ic_cart'),
  },
];

export default navConfig;
