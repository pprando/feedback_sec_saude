import { Client } from 'pg'

export default defineEventHandler(async (event) => {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'DATABASE_URL nao configurada'
    }
  }

  const client = new Client({
    connectionString
  })

  try {
    const body = await readBody(event)

    const protocolo = `FB-${Date.now()}`

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

    return {
      success: true,
      protocolo
    }

  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Erro ao salvar feedback'
    }
  } finally {
    await client.end().catch(() => {})
  }
})
