import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Join.css";

const Join = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  return (
    <section className="container">
      <div className="login-interface">
        <h3>Login</h3>

        <div className="name">
          <input type="text" value={name} onChange={(event) => {setName(event.target.value)}} placeholder="Enter your name..." />
        </div>

        <div className="room">
          <input type="text" value={room} onChange={(event) => setRoom(event.target.value)} placeholder="Enter the room name" />
        </div>

        <Link onClick={event => (!name || !room) ? event.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
          <button className="btn-join">Valider</button>
        </Link>
      </div>
    </section>
  );
}

export default Join;
