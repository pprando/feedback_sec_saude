import { Client } from 'pg'

export default defineEventHandler(async (event) => {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString && !process.env.POSTGRES_HOST) {
    console.error('DATABASE_URL ou POSTGRES_HOST nao configurados')
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Configuracao do banco nao encontrada'
    }
  }

  const client = connectionString
    ? new Client({ connectionString })
    : new Client({
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.POSTGRES_PORT || 5432),
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || '',
        database: process.env.POSTGRES_DB || 'feedback_db'
      })

  try {
    const body = await readBody(event)
    console.log('POST /api/feedback body:', body)

    const protocolo = `FB-${Date.now()}`

    await client.connect()

    await client.query(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(50) NOT NULL,
        descricao TEXT NOT NULL,
        nome VARCHAR(255),
        telefone VARCHAR(50),
        email VARCHAR(255),
        anonimo BOOLEAN NOT NULL DEFAULT FALSE,
        protocolo VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

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
      message: error instanceof Error ? error.message : 'Erro ao salvar feedback'
    }
  } finally {
    await client.end().catch(() => {})
  }
})
