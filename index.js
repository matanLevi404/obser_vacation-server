// imports
const exp = require("express");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();

const { SQL } = require("./dbconfig");

// inits
const app = exp();
const corsOptions = {
  origin: "http://localhost:3000", // for standard react client side
  credentials: true,
};

// middlewares
app.use(exp.json());
app.use(cors(corsOptions));
app.use(
  session({
    secret: "@obser_vacationKeyHolder@",
    name: "session",
    saveUninitialized: true,
    resave: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

// listen

app.use("/vacations", require("./routes/vacations"));
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/admin", require("./routes/admin"));

const port = process.env.PORT || 1001;

app.listen(port, () => {
  console.log("Server is up and running on port: " + port);
});
