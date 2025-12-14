require("dotenv").config();

const serverless = require("serverless-http");
const app = require("./app");

const PORT = process.env.PORT || 5000;

module.exports = serverless(app);

// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });
