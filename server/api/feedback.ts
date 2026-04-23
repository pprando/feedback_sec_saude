import { Client } from 'pg'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    const query = getQuery(event)

    if (!query.protocolo) {
      return {
        statusCode: 400,
        body: { error: 'Protocolo é obrigatório' }
      }
    }

    try {
      const client = new Client({
        connectionString: process.env.DATABASE_URL
      })

      await client.connect()

      const result = await client.query(
        `SELECT * FROM feedbacks WHERE protocolo = $1`,
        [query.protocolo]
      )

      await client.end()

      return result.rows[0] || null
    } catch (error) {
      console.error(error)
      return {
        statusCode: 500,
        body: { error: 'Erro ao buscar feedback' }
      }
    }
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event)

      const protocolo = `FB-${Date.now()}`

      const client = new Client({
        connectionString: process.env.DATABASE_URL
      })

      await client.connect()

      await client.query(
        `INSERT INTO feedbacks 
        (tipo, unidade, descricao, nome, telefone, email, anonimo, protocolo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          body.tipo,
          body.unidade,
          body.descricao,
          body.nome,
          body.telefone,
          body.email,
          body.anonimo,
          protocolo
        ]
      )

      await client.end()

      return {
        success: true,
        protocolo
      }

    } catch (error) {
      console.error(error)
      return {
        success: false
      }
    }
  }
})
