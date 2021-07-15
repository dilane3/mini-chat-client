import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import Message from './Message';

import "./Chat.css";

const Chat = ({ location }) => {
  const [size, setSize] = useState({width: window.innerWidth, height: window.innerHeight});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    window.onresize = function() {
      setSize({width: window.innerWidth, height: window.innerHeight});
    }
  });

  useEffect(() => {
    const data = queryString.parse(location.search);

    const socket = io(ENDPOINT);

    socket.emit("join", {name, room}, ({ error }) => {
      console.log(error);
    });

    setName(data.name);
    setRoom(data.room);
  }, [ENDPOINT, location.search]);

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
          <input value={message} type="text" onChange={event => setMessage(event.target.value)} placeholder="type a message..." />
          <button onClick={handleSendMessage} className="btn btn-send">
            <i className="bi bi-cursor-fill"></i>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Chat;
