import { Client } from 'pg'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const protocolo = `FB-${Date.now()}`

    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })

    await client.connect()

    await client.query(
      `INSERT INTO feedbacks 
      (tipo, descricao, nome, telefone, email, anonimo, protocolo)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        body.tipo,
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
})