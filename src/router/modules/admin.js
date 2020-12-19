export default [
  {
    path: '',
    component: () => import('@/layouts/main/Main.vue'),
    children: [
      {
        path: '/admin/applications/view/:userID/:applicationID',
        name: 'AdminApplication',
        component: () => import('@/views/admin/Application.vue'),
        meta: {
          requiresAuth: true,
          roles: ['[ICE] Recruiter', '[ICE] Owner', "[ICE] Webmaster"]
        },
        props: true
      },
      {
        path: '/admin/applications',
        name: 'AdminApplications',
        component: () => import('@/views/admin/Applications.vue'),
        meta: {
          requiresAuth: true,
          roles: ['[ICE] Recruiter', '[ICE] Owner', "[ICE] Webmaster"]
        },
      },
      {
        path: '/admin/17th/users',
        name: 'Admin17thUsers',
        component: () => import('@/views/admin/17th/Users.vue'),
        meta: {
          requiresAuth: true,
          roles: ['[ICE] Owner', '[17th] NCO', '[17th] Alpha Company HQ', '[17th] 1st Platoon HQ', '[17th] 32nd LSG HQ', "[ICE] Webmaster"]
        },
      },
      {
        path: '/developer/roles',
        name: 'RolesPage',
        component: () => import('@/views/developer/RolesPage'),
        meta: {
          requiresAuth: true,
          roles: ['[ICE] Owner', '[17th] NCO', '[17th] Alpha Company HQ', '[17th] 1st Platoon HQ', '[17th] 32nd LSG HQ', "[ICE] Webmaster"]
        },
      },
      {
        path: '/developer/lookup',
        name: 'UserLookup',
        component: () => import('@/views/developer/UserLookup'),
        meta: {
          requiresAuth: true,
          roles: ['[ICE] Webmaster']
        },
      }
    ]
  }
]
