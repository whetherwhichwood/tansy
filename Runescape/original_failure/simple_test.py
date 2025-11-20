#!/usr/bin/env python3
"""
Simple test script to verify the Runescape bot environment
"""

import os
import sys

def test_database_connection():
    """Test database connection"""
    try:
        import psycopg2
        conn = psycopg2.connect(
            host="localhost",
            port="5435",
            database="testdb",
            user="postgres",
            password="test123"
        )
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        result = cursor.fetchone()
        print(f"Database connection successful: {result[0][:50]}...")
        conn.close()
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False

def test_credentials_file():
    """Test if credentials file exists"""
    if os.path.exists("credentials.properties"):
        print("Credentials file found")
        return True
    else:
        print("Credentials file not found")
        return False

def test_bot_code():
    """Test if bot code exists"""
    bot_path = "dockerbot-dev/persistence/osrs_bot"
    if os.path.exists(bot_path):
        files = os.listdir(bot_path)
        print(f"Bot code found with {len(files)} files")
        return True
    else:
        print("Bot code not found")
        return False

def main():
    print("Testing Runescape Bot Environment")
    print("=" * 50)
    
    # Test database
    print("\nTesting Database Connection...")
    db_ok = test_database_connection()
    
    # Test credentials
    print("\nTesting Credentials File...")
    cred_ok = test_credentials_file()
    
    # Test bot code
    print("\nTesting Bot Code...")
    code_ok = test_bot_code()
    
    # Summary
    print("\n" + "=" * 50)
    print("Test Summary:")
    print(f"Database: {'Working' if db_ok else 'Failed'}")
    print(f"Credentials: {'Working' if cred_ok else 'Failed'}")
    print(f"Bot Code: {'Working' if code_ok else 'Failed'}")
    
    if db_ok and cred_ok and code_ok:
        print("\nEnvironment is ready!")
        print("You can now:")
        print("1. Study the bot code in dockerbot-dev/persistence/osrs_bot/")
        print("2. Use the credentials.properties file for authentication")
        print("3. Start developing your own bot features")
    else:
        print("\nSome components need attention")

if __name__ == "__main__":
    main()
