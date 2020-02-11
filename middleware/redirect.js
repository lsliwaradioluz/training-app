export default (context) => {

  if (context.route.path == '/') {
    return context.redirect('/dashboard');
  }

  if (context.store.state.auth.user == null) {
    return context.redirect('/login');
  }
}