import { Handler, Context, APIGatewayEvent } from "aws-lambda";

exports.handler = async function(event: APIGatewayEvent, context: Context) {
  try {
    const person = JSON.parse(event.body as string)
    // const body = await hello();
    return { statusCode: 200, body: JSON.stringify(person) };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
