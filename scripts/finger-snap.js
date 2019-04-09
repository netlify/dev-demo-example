#!/usr/bin/env node

/* Import faunaDB sdk */
const faunadb = require("faunadb")

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

console.log("Adjusting the gauntlet…")

client
  .query(q.Paginate(q.Match(q.Ref("indexes/all_items"))))
  .then(response => {
    const itemRefs = response.data
    const getAllItemsDataQuery = itemRefs.map(ref => {
      return q.Get(ref)
    })
    console.log("Admiring infinity stones first…")
    return client.query(getAllItemsDataQuery).then(ret => {
      Promise.all(
        ret.map(el => {
          if (Math.random() >= 0.5) {
            return null
          }
          return client
            .query(q.Delete(q.Ref(`classes/items/${el.ref.id}`)))
            .then(response => {
              console.log(`Message from ${el.data.name}: I don't feel so good…`)
            })
        })
      ).then(() => console.log(`_silence_`))
    })
  })
  .catch(e => console.error(e))
