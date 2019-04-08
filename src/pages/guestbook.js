import React, { useState, useEffect } from "react"

// import Layout from "../components/layout"
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

  console.log({ messages })
  const deleteMsg = ref => e => {
    console.log({ ref })
    e.preventDefault()
    setSaving(true)
    const idToDelete = ref["@ref"].id
    fetch("/.netlify/functions/fauna/" + idToDelete, {
      method: "DELETE",
    })
      // optimistic
      .then(() => {
        console.log({ idToDelete })
        const newMsgs = messages.filter(
          msg => msg.ref["@ref"].id !== idToDelete
        )
        console.log({ newMsgs })
        setMessages(messages.filter(msg => msg.ref["@ref"].id !== idToDelete))
      })
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
          <h2>A messaging app for super-villans</h2>
        </div>

        {messages === null && <div>Loading guestbook...</div>}
        {messages &&
          (messages.name === "BadRequest" ? (
            <div>
              Bad Request - you may have forgotten to setup your Fauna DB addon
              and run{" "}
              <pre>netlify dev:exec functions/fauna/create-schema.js</pre>
            </div>
          ) : (
            messages.map(message => (
              <div className="msg" key={message.ts}>
                <div>
                  <p>{message.data.message.trim()}</p>
                  <button className="delete-btn"
                    onClick={deleteMsg(message.ref)}
                  >
                  </button>
                </div>
                <h2 className="msg-author">
                  {message.data.name}
                </h2>
              </div>
            ))
          ))}

        <div>
          <form className="guestbook-form" onSubmit={submit}>
            <div className="form-control">
              <label>Your evil name:</label>
              <input
                type="text"
                value={message.name}
                required
                onChange={e => setMessage({ ...message, name: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label>Your evil message:</label>
              <textarea
                value={message.message}
                required
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
