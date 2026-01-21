import { Client } from "pg";

export const handler = async (event) => {
  const { id, edad, kg, tiempo, rockport, sexo } = JSON.parse(event.body);

  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    const result = await client.query(`
      UPDATE alumno
      SET edad = $1,
          kg = $2,
          tiempo = $3,
          rockport = $4,
          sexo = $5
      WHERE id = $6
      RETURNING id
    `, [edad, kg, tiempo, rockport, sexo, id]);

    if (result.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ ok: false, message: "Alumno no encontrado" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        id: result.rows[0].id
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: error.message })
    };
  } finally {
    await client.end();
  }
};
