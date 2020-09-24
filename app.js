const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const isAuth = require('./middleware/is-auth');

const app = express();

app.use(express.json());

app.use(isAuth);

app.use(
    "/graphql",
    graphqlHTTP({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true,
    })
);

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@quiz.hvhc1.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        }
    )
    .then(() => {
        console.log(`Connected to database ${process.env.MONGO_DB}`);
    })
    .catch((err) => {
        console.error(`Failed to connect database ${process.env.MONGO_DB}`);
        console.error(err);
    });


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`you are listen to port ${PORT}`);  
});
