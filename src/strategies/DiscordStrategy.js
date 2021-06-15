const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const DiscordUser = require('../models/DiscordUser');

passport.serializeUser((user, done) => {
	console.log("Serializing User");
	console.log(user);
	done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
	const user = await DiscordUser.findById(id);
	if(user)
		done(null, user);
});

passport.use(new DiscordStrategy({
	clientID: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	callbackURL: process.env.CLIENT_REDIRECT,
	scope: ['identify', 'guilds']
}, async (accessToken, refreshToken, profile, done) => {
	try {
		const user = await DiscordUser.findOne({
			discordId: profile.id,
			email: profile.id.email
		});
		if(user)
		{
			console.log("Congrat's! We know you! Welcome back.");
			done(null, user);
		}
		else {

			console.log("We do not know you. How sad.");
			const newUser = await DiscordUser.create({
				discordId: profile.id,
				username: profile.username,
				email: profile.id.email
			});
			const savedUser = await newUser.save();
			done(null, savedUser);
		}
	}
	catch(err) {
		console.log(err);
		done(err, null);
	}
}));