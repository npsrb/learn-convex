import { useState } from "react";
import { useMutation, useQuery } from "../convex/_generated/react";
import FacePile from "./Facepile";
import usePresence from "./hooks/usePresence";

const Emojis =
  "๐ ๐ ๐ ๐ ๐ ๐ ๐ ๐คฃ ๐ฅฒ ๐ฅน ๐ ๐ ๐ ๐ ๐ ๐ ๐ ๐ฅฐ ๐ ๐ ๐ ๐ ๐ ๐ ๐ ๐ ๐คช ๐ ๐ฅธ ๐คฉ ๐ฅณ ๐ ๐ณ ๐ค ๐ซข ๐คญ ๐คซ ๐ถ ๐ซ  ๐ฎ ๐คค ๐ตโ๐ซ ๐ฅด ๐ค ๐ค ".split(
    " "
  );

const initialEmoji = Emojis[Math.floor(Math.random() * Emojis.length)];

export default function App() {
  const messages = useQuery("listMessages") || [];

  const [newMessageText, setNewMessageText] = useState("");
  const sendMessage = useMutation("sendMessage");

  const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));
  const [myPresence, othersPresence, updateMyPresence] = usePresence(
    "chat-room",
    name,
    {
      name,
      emoji: initialEmoji,
    }
  );
  async function handleSendMessage(event) {
    event.preventDefault();
    setNewMessageText("");
    await sendMessage(newMessageText, name);
  }
  return (
    <main>
      <h1>Convex Chat</h1>
      <p className="badge">
        <span>{name}</span>
        <select
          defaultValue={myPresence.emoji}
          onChange={e => updateMyPresence({ emoji: e.target.value })}
        >
          {Emojis.map(e => (
            <option key={e}>{e}</option>
          ))}
        </select>
      </p>
      <ul>
        {messages.map(message => (
          <li key={message._id.toString()}>
            <span>{message.author}:</span>
            <span>{message.body}</span>
            <span>{new Date(message._creationTime).toLocaleTimeString()}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage}>
        <FacePile othersPresence={othersPresence ?? []} />
        <input
          value={newMessageText}
          onChange={event => setNewMessageText(event.target.value)}
          placeholder="Write a messageโฆ"
        />
        <input type="submit" value="Send" disabled={!newMessageText} />
      </form>
    </main>
  );
}
