import React, { useState, useEffect } from "react"

import Layout from "../components/layout"

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
    <Layout>
      <h1>Guestbook!</h1>

      {messages === null && <div>Loading guestbook...</div>}
      {messages &&
        messages.map(message => (
          <div className="msg" key={message.ts}>
            <h2>{message.data.name}</h2>
            <div>
              {message.data.message.split(/\n/).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}

      <div>
        <form className="guestbook-form" onSubmit={submit}>
          <div className="form-control">
            <label>Your name:</label>
            <input
              type="text"
              value={message.name}
              onChange={e => setMessage({ ...message, name: e.target.value })}
            />
          </div>
          <div className="form-control">
            <label>Your message:</label>
            <textarea
              value={message.message}
              onChange={e =>
                setMessage({ ...message, message: e.target.value })
              }
            />
          </div>
          <div className="form-control">
            <button type="submit" disabled={saving}>
              {saving ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default GuestbookPage
