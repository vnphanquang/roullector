export const FILES = {
  '__components': {
    'Navbar.svelte': '',
    'Footer.svelte': '',
  },
  '__layout.svelte': '',
  '__error.svelte': '',
  'me.svelte': '',
  'sign-in.svelte': '',
  'sign-up.svelte': '',
  'index.svelte': '',
  'admin': {
    '__components': {
      'Admin.layout.svelte': '',
      'types.ts': '',
    },
    'users': {
      '[id]': {
        '__layout.svelte': '',
        'index.svelte': '',
        'types.ts': '',
        'posts': {
          '[post_id].svelte': '',
          's-[slug].svelte': '',
          'l-[short-link]-l.svelte': '',
        },
      },
      'index.svelte': '',
    },
  }
};
