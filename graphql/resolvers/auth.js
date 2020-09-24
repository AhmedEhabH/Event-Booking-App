const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const User = require("../../models/user");

module.exports = {
    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });

            if (existingUser) {
                throw new Error("User exists already.");
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword,
            });
            const result = await user.save()
            return {
                ...result._doc,
                _id: result.id,
                password: null,
            };
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            console.error("User does not exist!");
            throw new Error("User does not exist!");
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            console.error("Password is incorrect!");
            throw new Error("Password is incorrect!");
        }

        const token = jwt.sign({
            userId: user.id,
            email: user.email
        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        }
    }
}