import { v4 as uuidv4 } from "uuid";

const generateRoomId = () => {
  return `room-${uuidv4()}`;
};

export default generateRoomId;
