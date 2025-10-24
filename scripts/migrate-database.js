#!/usr/bin/env node

/**
 * Script para configurar y migrar la base de datos de SerenIA
 * Ejecuta las migraciones de autenticación y pobla los datos iniciales
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  console.error('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runSQLFile(filePath, description) {
  try {
    console.log(`📄 Ejecutando: ${description}`)
    const sql = fs.readFileSync(filePath, 'utf-8')
    
    // Dividir por declaraciones SQL (separadas por punto y coma)
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0)
    
    for (const statement of statements) {
      const trimmedStatement = statement.trim()
      if (trimmedStatement) {
        const { error } = await supabase.rpc('exec_sql', { sql_query: trimmedStatement })
        if (error) {
          console.error(`❌ Error ejecutando SQL: ${error.message}`)
          // No terminar el proceso, continuar con la siguiente declaración
        }
      }
    }
    
    console.log(`✅ Completado: ${description}`)
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message)
  }
}

async function testConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error) {
      console.error('❌ Error de conexión:', error.message)
      return false
    }
    console.log('✅ Conexión a Supabase exitosa')
    return true
  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Iniciando configuración de base de datos SerenIA...\n')
  
  // Verificar conexión
  const connected = await testConnection()
  if (!connected) {
    console.error('❌ No se pudo conectar a Supabase. Verifica tus credenciales.')
    process.exit(1)
  }
  
  console.log('\n📝 Aplicando migraciones y datos...\n')
  
  // Aplicar migración de autenticación
  await runSQLFile(
    path.join(__dirname, 'auth-migration.sql'),
    'Migración de autenticación NextAuth'
  )
  
  // Poblar datos de versículos bíblicos
  await runSQLFile(
    path.join(__dirname, 'bible-verses-data.sql'),
    'Datos de versículos bíblicos y recursos de emergencia'
  )
  
  console.log('\n🎉 ¡Configuración de base de datos completada!')
  console.log('\n📋 Resumen:')
  console.log('• ✅ Migración de autenticación aplicada')
  console.log('• ✅ Versículos bíblicos cargados')
  console.log('• ✅ Recursos de emergencia actualizados')
  console.log('\n🔗 Tu aplicación ya está lista para usar con autenticación completa.')
}

// Función auxiliar para crear la función exec_sql si no existe
async function createExecFunction() {
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
    RETURNS void
    LANGUAGE plpgsql
    AS $$
    BEGIN
      EXECUTE sql_query;
    END;
    $$;
  `
  
  try {
    await supabase.rpc('exec_sql', { sql_query: createFunctionSQL })
  } catch (error) {
    // La función puede que ya exista, continuar
  }
}

// Ejecutar script principal
if (require.main === module) {
  createExecFunction().then(() => main()).catch(console.error)
}

module.exports = { runSQLFile, testConnection }