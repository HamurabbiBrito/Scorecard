# seed.py
import psycopg2
import bcrypt
from dotenv import load_dotenv
import os
import uuid
from urllib.parse import urlparse

load_dotenv()

def create_users():
    # Obtener y parsear DATABASE_URL
    db_url = os.getenv("DATABASE_URL")
    result = urlparse(db_url)

    # Extraer partes de la URL
    username = result.username
    password = result.password
    database = result.path[1:]
    hostname = result.hostname
    port = result.port

    # Conexión
    conn = psycopg2.connect(
        dbname=database,
        user=username,
        password=password,
        host=hostname,
        port=port,
        options=f"-c search_path=public"
    )
    
    try:
        cur = conn.cursor()
        
        # Crear usuario admin
        admin_pw = bcrypt.hashpw(b'admin123', bcrypt.gensalt()).decode('utf-8')
        cur.execute("""
            INSERT INTO "User" (id, username, password, role, "createdAt", "updatedAt") 
            VALUES (%s, %s, %s, %s, NOW(), NOW())
            ON CONFLICT (username) DO NOTHING
            """, (str(uuid.uuid4()), 'admin', admin_pw, 'SA'))
        
        # Crear usuario operador
        operador_pw = bcrypt.hashpw(b'operador123', bcrypt.gensalt()).decode('utf-8')
        cur.execute("""
            INSERT INTO "User" (id, username, password, role, "createdAt", "updatedAt") 
            VALUES (%s, %s, %s, %s, NOW(), NOW())
            ON CONFLICT (username) DO NOTHING
            """, (str(uuid.uuid4()), 'operador1', operador_pw, 'Operador'))
        
        conn.commit()
        print("✅ Usuarios creados exitosamente")
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    create_users()
