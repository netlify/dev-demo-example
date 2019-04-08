import React, { useState, useEffect } from "react"

import { withPrefix } from "gatsby"

const GuestbookPage = () => {
  const [messages, setMessages] = useState(null)
  const [message, setMessage] = useState({ name: "", message: "" })
  const [saving, setSaving] = useState(false)

  let polling = true
  const poll = () => {
    fetch("/.netlify/functions/fauna")
      .then(response => response.json())
      .then(messages => setMessages(messages))
      .then(() => polling && setTimeout(poll, 10000))
  }
  const submit = e => {
    e.preventDefault()
    setSaving(true)
    fetch("/.netlify/functions/fauna", {
      method: "POST",
      body: JSON.stringify(message),
    })
      .then(() =>
        setMessages(
          messages.concat({ data: message, ts: new Date().getTime() })
        )
      )
      .then(() => setMessage({ name: "", message: "" }))
      .then(() => setSaving(false))
  }

  useEffect(() => {
    poll()
    return () => (polling = false)
  }, [])

  return (
    <div className="revengers">
      <div className="chicken-wrap">
        <div className="revengers-title">
          <img src={withPrefix("/RevengersLogo@2x.png")} alt="Logo" />
          <h2>A messaging app for super-villains</h2>
        </div>

        {messages === null && <div>Loading guestbook...</div>}
        {messages &&
          messages.map(message => (
            <div className="msg" key={message.ts}>
              <div>
                {message.data.message.split(/\n/).map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <h2 className="msg-author">{message.data.name}</h2>
            </div>
          ))}

        <div>
          <form className="guestbook-form" onSubmit={submit}>
            <div className="form-control">
              <label>Your evil name:</label>
              <input
                type="text"
                value={message.name}
                onChange={e => setMessage({ ...message, name: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label>Your evil message:</label>
              <textarea
                value={message.message}
                onChange={e =>
                  setMessage({ ...message, message: e.target.value })
                }
              />
            </div>
            <div className="form-control">
              <button className="submit-btn" type="submit" disabled={saving}>
                {saving ? "Sending..." : "SEND MESSAGE, in a evil way"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default GuestbookPage
