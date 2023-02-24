const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/userSchema");
passport.use(
  new FacebookStrategy(
    {
      clientID: "1220491981891933",
      clientSecret: "a19087861fb93185ad864ce0da136bf6",
      callbackURL: "/auth/facebook/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne(
        { userId: profile.id }.then((existingUser) => {
          if (existingUser) {
            done(null, existingUser);
          } else {
            new User({
              userId: profile.id,
              username: profile.displayName,
              picture: profile._json.picture,
            })
              .save()
              .then((user) => {
                done(null, user);
              });
          }
        }),
        function (err, user) {
          return done(err, user);
        }
      );
    }
  )
);
