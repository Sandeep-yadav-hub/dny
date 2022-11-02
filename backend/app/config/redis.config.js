let redis = require("redis");
var options = {
  host: "redis",
  port: 6379,
  auth_pass: "",
};

let client = redis.createClient(options);

client.on("error", (error) => {
  console.log(error);
});

module.exports = client;