import http from "../http-common";

class UsersDataService {
  findAll(username) {
    return http.get("/users", { params: { username } });
  }

  get(id) {
    return http.get(`/users/${id}`);
  }

  create(data) {
    return http.post("/users", data);
  }

  update(id, data) {
    return http.put(`/users/${id}`, data);
  }

  delete(id) {
    return http.delete(`/users/${id}`);
  }

  login(data) {
    return http.post("/users/login", data);
  }
}

export default new UsersDataService();
