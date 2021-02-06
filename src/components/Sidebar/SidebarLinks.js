const SidebarLinks = {
  Account: {
    text: 'MY ACCOUNT',
    route: 'Account',
    icon: 'w-watermark',
    type: 'profile',
  },
  Details: {
    text: 'MY DETAILS',
    route: 'Details',
    icon: 'w-watermark',
    type: 'profile',
  },
  OpenDraws: {
    text: 'OPEN DRAWS',
    route: 'LotteriesList',
    icon: 'draw',
    type: 'menu',
    routeParams: {
      status: 'live',
      type: 'all',
    },
  },
  PendingDraws: {
    text: 'PENDING DRAWS',
    route: 'LotteriesList',
    icon: 'draw',
    type: 'menu',
    routeParams: {
      status: 'ready',
      type: 'all',
    },
  },
  ClosedDraws: {
    text: 'CLOSED DRAWS',
    route: 'LotteriesList',
    icon: 'draw',
    type: 'menu',
    routeParams: {
      status: 'closed',
      type: 'all',
    },
  },
  Documents: {
    text: 'Documents',
    accordion: [
      {
        text: 'ACCESSIBILITY',
        route: 'Accessibility',
      },
      {
        text: 'COMPLAINTS',
        route: 'Complaints',
      },
      {
        text: 'GDPR',
        route: 'GDPR',
      },
      {
        text: 'T & C\'s',
        route: 'Terms',
      },
      {
        text: 'PRIVACY POLICY',
        route: 'Privacy',
      },
      {
        text: 'ABOUT THE APP',
        route: 'About',
      },
    ],
    type: 'menu',
    icon: 'docs',
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
