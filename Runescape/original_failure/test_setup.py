#!/usr/bin/env python3
"""
Simple test script to verify the Runescape bot environment
"""

import os
import sys
import requests
import time

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
        print(f"✅ Database connection successful: {result[0][:50]}...")
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_redis_connection():
    """Test Redis connection"""
    try:
        import redis
        r = redis.Redis(host='localhost', port=6379, decode_responses=True)
        r.ping()
        print("✅ Redis connection successful")
        return True
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
        return False

def test_bot_api():
    """Test bot API"""
    try:
        response = requests.get("http://localhost:8080/health", timeout=5)
        if response.status_code == 200:
            print("✅ Bot API is responding")
            return True
        else:
            print(f"❌ Bot API returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Bot API connection failed: {e}")
        return False

def main():
    print("🧪 Testing Runescape Bot Environment")
    print("=" * 50)
    
    # Test database
    print("\n📊 Testing Database Connection...")
    db_ok = test_database_connection()
    
    # Test Redis (optional)
    print("\n🔄 Testing Redis Connection...")
    redis_ok = test_redis_connection()
    
    # Test bot API
    print("\n🤖 Testing Bot API...")
    api_ok = test_bot_api()
    
    # Summary
    print("\n" + "=" * 50)
    print("📋 Test Summary:")
    print(f"Database: {'✅ Working' if db_ok else '❌ Failed'}")
    print(f"Redis: {'✅ Working' if redis_ok else '❌ Failed'}")
    print(f"Bot API: {'✅ Working' if api_ok else '❌ Failed'}")
    
    if db_ok:
        print("\n🎉 Basic environment is working!")
        print("You can now:")
        print("1. Study the bot code in dockerbot-dev/persistence/osrs_bot/")
        print("2. Use the credentials.properties file for authentication")
        print("3. Start developing your own bot features")
    else:
        print("\n⚠️  Some components need attention")
        print("Try running: docker ps to see what's running")

if __name__ == "__main__":
    main()
