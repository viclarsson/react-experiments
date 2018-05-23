import request from "superagent";

const API_URL = "http://localhost:3001";

export function postFormData(formData) {
  return request.post(`${API_URL}/file-upload`).send(formData);
}
