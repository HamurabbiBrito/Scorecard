# seed.py
import psycopg2
import bcrypt
from dotenv import load_dotenv
import os
import uuid  # Importamos uuid para generar IDs

load_dotenv()

def create_users():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5432'),
        dbname=os.getenv('DB_NAME', 'scorecard'),
        user=os.getenv('DB_USER', 'postgres'),
        password=os.getenv('DB_PASSWORD', ''),
        options=f"-c search_path={os.getenv('DB_SCHEMA', 'public')}"
    )
    
    try:
        cur = conn.cursor()
        
        # Crear usuario admin
        admin_pw = bcrypt.hashpw(b'admin123', bcrypt.gensalt()).decode('utf-8')
        cur.execute("""
            INSERT INTO "User" (id, username, password, role, "createdAt") 
            VALUES (%s, %s, %s, %s, NOW())
            ON CONFLICT (username) DO NOTHING
            """, (str(uuid.uuid4()), 'admin', admin_pw, 'SA'))
        
        # Crear usuario operador
        operador_pw = bcrypt.hashpw(b'operador123', bcrypt.gensalt()).decode('utf-8')
        cur.execute("""
            INSERT INTO "User" (id, username, password, role, "createdAt") 
            VALUES (%s, %s, %s, %s, NOW())
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