import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Job Postings',
    roles: ['User', 'Admin'],
  },
  {
    displayName: 'Main-Dashboard',
    iconName: 'solar:posts-carousel-vertical-bold',
    route: '/main/main-dashboard',
    roles: ['User', 'Admin'],
  },

  {
    navCap: 'User Profile',
    divider: true,
    roles: ['User', 'Admin'],
  },
  {
    displayName: 'Profile',
    iconName: 'solar:user-bold',
    route: '/main/user-profile',
    roles: ['User', 'Admin'],
  },
  {
    displayName: 'Requirements',
    iconName: 'solar:clipboard-list-bold',
    route: '/main/requirements',
    roles: ['User', 'Admin'],
  },

  {
    navCap: 'Job Application Dashboard',
    divider: true,
    roles: ['User', 'Admin'],
  },
  {
    displayName: 'Job Application Status',
    iconName: 'solar:archive-minimalistic-bold',
    route: '/main/job-application',
    roles: ['User', 'Admin'],
  },
  {
    displayName: 'Job Offer',
    iconName: 'solar:pen-2-bold',
    route: '/main/job-offer',
    roles: ['User', 'Admin'],
  },
  {
    displayName: 'Appointment Calendar',
    iconName: 'solar:calendar-broken',
    route: '/main/appointment-calendar',
    roles: ['User', 'Admin'],
  },

  {
    navCap: 'UI Components',
    divider: true,
    roles: ['Admin'],
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:widget-add-line-duotone',
    route: '/dashboard',
    roles: ['Admin'],
  },
  {
    displayName: 'Badge',
    iconName: 'solar:archive-minimalistic-line-duotone',
    route: '/ui-components/badge',
    roles: ['Admin'],
  },
  {
    displayName: 'Chips',
    iconName: 'solar:danger-circle-line-duotone',
    route: '/ui-components/chips',
    roles: ['Admin'],
  },
  {
    displayName: 'Lists',
    iconName: 'solar:bookmark-square-minimalistic-line-duotone',
    route: '/ui-components/lists',
    roles: ['Admin'],
  },
  {
    displayName: 'Menu',
    iconName: 'solar:file-text-line-duotone',
    route: '/ui-components/menu',
    roles: ['Admin'],
  },
  {
    displayName: 'Tooltips',
    iconName: 'solar:text-field-focus-line-duotone',
    route: '/ui-components/tooltips',
    roles: ['Admin'],
  },
  {
    displayName: 'Forms',
    iconName: 'solar:file-text-line-duotone',
    route: '/ui-components/forms',
    roles: ['Admin'],
  },
  {
    displayName: 'Tables',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/tables',
    roles: ['Admin'],
  },

  {
    navCap: 'Auth',
    divider: true,
    roles: ['Admin'],
  },
  {
    displayName: 'Login',
    iconName: 'solar:login-3-line-duotone',
    route: '/authentication/login',
    roles: ['Admin'],
  },
  {
    displayName: 'Register',
    iconName: 'solar:user-plus-rounded-line-duotone',
    route: '/authentication/register',
    roles: ['Admin'],
  },

  {
    navCap: 'Extra',
    divider: true,
    roles: ['Admin'],
  },
  {
    displayName: 'Icons',
    iconName: 'solar:sticker-smile-circle-2-line-duotone',
    route: '/extra/icons',
    roles: ['Admin'],
  },
  {
    displayName: 'Sample Page',
    iconName: 'solar:planet-3-line-duotone',
    route: '/extra/sample-page',
    roles: ['Admin'],
  },
];
