export default (context) => {
  if (
    context.store.state.auth.user == null 
    && !context.route.path.includes('login') 
    && !context.route.path.includes('register-coach')
    && !context.route.path.includes('register-trainee')
    ) {
    return context.redirect('/login');
  }
}