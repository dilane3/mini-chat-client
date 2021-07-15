import React from 'react';

const Message = ({ message }) => {
  const {author, content, date, type} = message;

  return (
    <div className={`message-bloc message-${type}`}>
      <article className="message">
        <span>{author}</span>
        <div className="message-content">
          {content}
        </div>
        <span>{date}</span>
      </article>
    </div>
  );
}

export default Message;
