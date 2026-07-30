import jwt from "jsonwebtoken";

const parseCookies = (cookieHeader = "") => {
  return cookieHeader.split(";").reduce((acc, part) => {
    const [name, ...rest] = part.trim().split("=");
    if (name) acc[name] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
};

const socketAuth = (socket, next) => {
  try {
    const cookies = parseCookies(socket.handshake.headers.cookie || "");
    const token = cookies.token || socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      return next(new Error("Authentication error: Invalid token"));
    }

    socket.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error(`Authentication error: ${error.message}`));
  }
};

export default socketAuth;
