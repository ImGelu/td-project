const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.username) {
    res.status(400).send({
      message: `Eroare interna`,
    });

    return;
  }

  const newUser = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    role: 0,
  };

  User.create(newUser)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: `Eroare interna`,
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: `Eroare interna`,
      });
    });
};

exports.update = (req, res) => {
  const id = req.body.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Datele au fost actualizate cu succes",
        });
      } else {
        res.send({
          message: `Eroare interna`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Eroare interna`,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Utilizatorul a fost sters cu succes!",
        });
      } else {
        res.send({
          message: `Eroare interna`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Eroare interna`,
      });
    });
};

exports.login = (req, res) => {
  User.findOne({ where: { username: req.body.username, password: req.body.password } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: `Eroare interna`,
      });
    });
};

exports.findAll = (req, res) => {
  const name = req.query.username;
  var condition = name ? { username: { [Op.like]: `%${name}%` } } : null;

  User.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: `Eroare interna`,
      });
    });
};
