import { Client } from "pg";

export const handler = async () => {
  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT id, nombre, apellido_paterno, apellido_materno, matricula, sexo, kg, edad, tiempo, rockport
      FROM alumno
      ORDER BY nombre
    `);

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    await client.end();
  }
};
