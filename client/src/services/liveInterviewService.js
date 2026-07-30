import axios from "axios";
import { ServerUrl } from "../config";

const api = axios.create({
  baseURL: `${ServerUrl}/api/live-interviews`,
  withCredentials: true,
});

export const createLiveInterview = (data) => api.post("/", data);

export const getHRInterviews = () => api.get("/hr");

export const getCandidateInterviews = () => api.get("/candidate");

export const getCandidates = () => api.get("/candidates");

export const deleteTestData = () => api.delete("/cleanup/test-data");

export const getInterviewById = (id) => api.get(`/${id}`);

export const updateLiveInterview = (id, data) => api.put(`/${id}`, data);

export const cancelLiveInterview = (id) => api.delete(`/${id}`);

export const endLiveInterview = (id) => api.post(`/${id}/end`);

export const updateUserRole = (role) =>
  axios.patch(`${ServerUrl}/api/user/role`, { role }, { withCredentials: true });
