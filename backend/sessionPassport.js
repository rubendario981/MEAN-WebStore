const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./modeloUsuario');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use('registro', new LocalStrategy({
  usernameField: 'correo',
  passwordField: 'password',
  passReqToCallback: true }, 
  async (req, correo, password, done) => {
  //const user = await User.findOne({'correo': correo })
  //console.log(user)
  //user ? done(null, false, ): 
  newUser = new User()
  newUser.email = email;
  newUser.password = newUser.validaPass(password);
  newUser.nombres = req.params.nombres;
  newUser.nickName = req.params.nickName;
  newUser.rol = req.params.rol;
  //console.log(newUser)
  await newUser.save();
  done(null, newUser);
  /* if (user) {
    return done(null, false, req.flash('signupMessage', 'The Email is already Taken.'));
  } else {
    const newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    console.log(newUser)
    await newUser.save();
    done(null, newUser);
  } */
}));

passport.use('local-signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    return done(null, false, req.flash('signinMessage', 'No User Found'));
  }
  if (!user.comparePassword(password)) {
    return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
  }
  return done(null, user);
}));
