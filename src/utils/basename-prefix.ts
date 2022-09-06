// suggested by bycaldr:
// https://github.com/remix-run/react-router/issues/8427#issuecomment-1056988913

if (!window.location.pathname.startsWith('/pnc-web')) {
  window.history.replaceState('', '', '/pnc-web' + window.location.pathname);
}

export {};
