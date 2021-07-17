import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import Message from './Message';

import "./Chat.css";

let socket;

const Chat = ({ location }) => {
  const [size, setSize] = useState({width: window.innerWidth, height: window.innerHeight});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('e');
  const [room, setRoom] = useState('f');
  const ENDPOINT = `https://mini-server-chat.herokuapp.com/`;

  useEffect(() => {
    window.onresize = function() {
      setSize({width: window.innerWidth, height: window.innerHeight});
    }
  });

  useEffect(() => {
    const {name, room} = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit("join", {name, room}, (error) => {

    });

    return () => {
      socket.emit("disconnect");

      socket.off();
    }
  }, [ENDPOINT, location.search]);


  useEffect(() => {
    socket.on("message", (message) => {
      const {user, text} = message;

      let msgs = [...messages];
      const date = new Date();
      const msg = {
        id: msgs.length === 0 ? 1 : msgs[msgs.length-1].id + 1,
        author: user,
        room,
        content: text,
        date: date.getHours() + ":" + date.getMinutes(),
        type: "received"
      }

      msgs.push(msg);

      setMessages(msgs);
      setMessage("");
    });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.length > 0) {
      let msgs = [...messages];
      const date = new Date();
      const msg = {
        id: msgs.length === 0 ? 1 : msgs[msgs.length-1].id + 1,
        author: name,
        room,
        content: message,
        date: date.getHours() + ":" + date.getMinutes(),
        type: "sended"
      }

      msgs.push(msg);

      socket.emit("sendMessage", message);

      setMessages(msgs);
      setMessage("");
    }
  }

  return (
    <section className="container1" style={size.width < 576 ? size : null}>
      <div className="conversation-interface">
        <header className="conversation-header">
          <div className="header-name">
            <i className="bi bi-dot"></i>
            <span>{name}</span>
          </div>

          <span>{room.length > 0 && room[0].toUpperCase() + room.substr(1).toLowerCase()}</span>
        </header>

        <main className="messages">
          {
            messages.map(message => <Message key={message.id} message={message} />)
          }
        </main>

        <div className="text-editor">
          <input
            value={message}
            type="text"
            onChange={event => setMessage(event.target.value)}
            onKeyPress={event => event.key === "Enter" && handleSendMessage()}
            placeholder="type a message..." />
          <button onClick={handleSendMessage} className="btn btn-send">
            <i className="bi bi-cursor-fill"></i>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Chat;
