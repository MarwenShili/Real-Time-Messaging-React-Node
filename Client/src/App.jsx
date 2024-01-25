import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import { Button, Input } from "antd";

const socket = io.connect("http://localhost:3001/");

function App() {
  const [message, setMessage] = useState("");
  const [joinedUsers, setJoinedUsers] = useState([]);

  const [room, setRoom] = useState("1");

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };
  const JoinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };
  useEffect(() => {
    socket.on("user_joined", (message) => {
      setJoinedUsers((prevJoinedUsers) => {
        const uniqueRooms = new Set([...prevJoinedUsers, message]);
        return Array.from(uniqueRooms);
      });
    });
  }, []);

  console.log(joinedUsers);

  useEffect(() => {
    socket.emit("join_room", "admin_room");
  }, []);

  return (
    <div className="app">
      <div className="home">
        <span>
          <Input
            status={room.length <= 0 ? "error" : ""}
            placeholder="Room Connection"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <Button onClick={JoinRoom}> Join Room</Button>
        </span>

        <span>
          <Input
            placeholder="Message..."
            onChange={(event) => {
              setMessage(event.target.value);
            }}
            status={message.length <= 0 ? "error" : ""}
          />
          <Button onClick={sendMessage}>Send Event</Button>
        </span>
        <h3>
          {joinedUsers?.map((el, index) => (
            <h3 key={index}>{el}</h3>
          ))}
        </h3>
      </div>
    </div>
  );
}

export default App;
