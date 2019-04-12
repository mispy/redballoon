async function hello() {
  return Promise.resolve("Hello, World");
}

exports.handler = async function(event: any, context: any) {
  try {
    const body = await hello();
    return { statusCode: 200, body };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
