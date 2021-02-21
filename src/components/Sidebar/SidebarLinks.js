const SidebarLinks = {
  Account: {
    text: 'MY ACCOUNT',
    route: 'About',
    icon: 'w-watermark',
    type: 'profile',
  },
  Details: {
    text: 'MY DETAILS',
    route: 'About',
    icon: 'w-watermark',
    type: 'profile',
  },
  Documents: {
    text: 'Documents',
    accordion: [
      {
        text: 'ACCESSIBILITY',
        route: 'About',
      },
      {
        text: 'COMPLAINTS',
        route: 'About',
      },
      {
        text: 'GDPR',
        route: 'About',
      },
      {
        text: 'T & C\'s',
        route: 'About',
      },
      {
        text: 'PRIVACY POLICY',
        route: 'About',
      },
      {
        text: 'ABOUT THE APP',
        route: 'About',
      },
    ],
    type: 'profile',
    icon: 'w-watermark',
  },
  Contact: {
    text: 'CONTACT US',
    route: 'Contact',
    icon: 'docs',
    type: 'menu',
  },
  SupportTickets: {
    text: 'SUPPORT TICKETS',
    route: 'SupportTickets',
    icon: 'docs',
    type: 'menu',
  },
};

export default SidebarLinks;
