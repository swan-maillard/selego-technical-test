import "isomorphic-fetch";

import { apiURL } from "../config";

class api {
  constructor() {
    this.token = "";
  }

  getToken() {
    return this.token;
  }

  setToken(token) {
    this.token = token;
  }

  // FIX: Replace the try/catch by then/catch to avoid sending an async promise

  get(path) {
    return new Promise((resolve, reject) => {
      fetch(`${apiURL}${path}`, {
        mode: "cors",
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `JWT ${this.token}` },
      })
        .then(async (response) => {
          const res = await response.json();
          resolve(res);
        })
        .catch((e) => reject(e));
    });
  }

  put(path, body) {
    return new Promise((resolve, reject) => {
      fetch(`${apiURL}${path}`, {
        mode: "cors",
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `JWT ${this.token}` },
        body: typeof body === "string" ? body : JSON.stringify(body),
      })
        .then(async (response) => {
          const res = await response.json();
          resolve(res);
        })
        .catch((e) => reject(e));
    });
  }

  remove(path) {
    return new Promise((resolve, reject) => {
      fetch(`${apiURL}${path}`, {
        mode: "cors",
        credentials: "include",
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `JWT ${this.token}` },
      })
        .then(async (response) => {
          const res = await response.json();
          resolve(res);
        })
        .catch((e) => reject(e));
    });
  }

  post(path, body) {
    return new Promise((resolve, reject) => {
      fetch(`${apiURL}${path}`, {
        mode: "cors",
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `JWT ${this.token}` },
        body: typeof body === "string" ? body : JSON.stringify(body),
      })
        .then(async (response) => {
          const res = await response.json();
          resolve(res);
        })
        .catch((e) => reject(e));
    });
  }
}

const API = new api();
export default API;
