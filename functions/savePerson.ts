import { Handler, Context, APIGatewayEvent } from "aws-lambda";
import faunadb = require('faunadb')

/* configure faunaDB Client with our secret */
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET||""
})

export async function savePerson(user: { name: string, email: string, referringUserId: string }) {
  try {
    await client.query(q.Create(q.Class("users"), { data: user })) as any
  } catch (err) {
    if (err.message === "instance not unique") {
      // Idempotent-- fine if already exists
    } else {
      throw err
    }
  }

  // Find the matching user entry (either we just created it or it already existed)
  // We specifically want a match on the unique combination of email-name-referringUserId
  return await client.query(q.Map(
    q.Paginate(
      q.Intersection(
        q.Match(q.Index("users_by_email"), user.email),
        q.Match(q.Index("users_by_name"), user.name),
        ... user.referringUserId ? [q.Match(q.Index("users_by_referringUserId"), user.referringUserId)] : []
      )
    ),
    q.Lambda("X", q.Get(q.Var("X")))
  )) as any
}

exports.handler = async function(event: APIGatewayEvent, context: Context) {
  try {
    const user = JSON.parse(event.body as string)
    const resp = await savePerson(user)
    return { statusCode: 200, body: JSON.stringify({ userId: resp.data[0].ref.id }) };
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: err.toString() };
  }
};
