import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [room, setRoom] = useState("");

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };
  const JoinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessageReceived(data.reply);
    });
  }, []);
  return (
    <>
      <div className="home">
        <input
          placeholder="Message..."
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        />
        <button onClick={JoinRoom}> Join Room</button>
        <br />
        <input
          placeholder="Message..."
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <button onClick={sendMessage}>Send Message</button>
        {messageReceived}
      </div>
    </>
  );
}

export default App;
