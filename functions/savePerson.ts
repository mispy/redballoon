import { Handler, Context, APIGatewayEvent } from "aws-lambda";
import faunadb = require('faunadb')

/* configure faunaDB Client with our secret */
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET||""
})

exports.handler = async function(event: APIGatewayEvent, context: Context) {
  try {
    const user = JSON.parse(event.body as string)

    try {
      await client.query(q.Create(q.Class("users"), { data: user })) as any
    } catch (err) {
      if (err.message === "instance not unique") {
        // That's fine, it's already there
      } else {
        throw err
      }
    }

    const resp = await client.query(q.Map(
      q.Paginate(
        q.Intersection(
          q.Match(q.Index("users_by_email"), user.email),
          q.Match(q.Index("users_by_name"), user.name),
          ... user.referringUserId ? [q.Match(q.Index("users_by_referringUserId"), user.referringUserId)] : []
        )
      ),
      q.Lambda("X", q.Get(q.Var("X")))
    )) as any

    // const body = await hello();  
    return { statusCode: 200, body: JSON.stringify({ userId: resp.data[0].ref.id }) };
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: err.toString() };
  }
};
