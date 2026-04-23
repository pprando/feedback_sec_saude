import { Client } from 'pg'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const protocolo = String(query.protocolo || '').trim()

  if (!protocolo) {
    setResponseStatus(event, 400)
    return {
      success: false,
      message: 'Informe um protocolo para consulta'
    }
  }

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
    await client.connect()

    await client.query(`ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS regiao VARCHAR(100) NOT NULL DEFAULT ''`)
    await client.query(`ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS unidade VARCHAR(255) NOT NULL DEFAULT ''`)
    await client.query(`ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS nota INTEGER NOT NULL DEFAULT 0`)

    const { rows } = await client.query(
      `SELECT
        id,
        tipo,
        regiao,
        unidade,
        nota,
        descricao,
        nome,
        telefone,
        email,
        anonimo,
        protocolo,
        created_at
      FROM feedbacks
      WHERE protocolo = $1
      LIMIT 1`,
      [protocolo]
    )

    if (!rows.length) {
      setResponseStatus(event, 404)
      return {
        success: false,
        message: 'Manifestacao nao encontrada'
      }
    }

    return {
      success: true,
      feedback: rows[0]
    }
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro ao consultar manifestacao'
    }
  } finally {
    await client.end().catch(() => {})
  }
})
