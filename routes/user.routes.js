module.exports = (app) => {
  const users = require("../controllers/user.controller");

  var router = require("express").Router();

  router.post("/", users.create);

  router.get("/", users.findAll);

  router.get("/:id", users.findOne);

  router.put("/:id", users.update);

  router.delete("/:id", users.delete);

  router.post("/login", users.login);

  //router.delete("/", users.deleteAll);

  app.use("/api/users", router);
};
