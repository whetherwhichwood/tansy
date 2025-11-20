#!/usr/bin/env python3
"""
Web interface for Runescape Bot management
"""

import os
from flask import Flask, render_template_string, jsonify, request
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Simple HTML template
HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Runescape Bot Management</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f0f0f0; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        .status { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .button { background: #3498db; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
        .button:hover { background: #2980b9; }
        .info { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="header">🤖 Runescape Bot Management</h1>
        
        <div class="status">
            <h3>System Status</h3>
            <p><strong>Bot Status:</strong> <span id="bot-status">Checking...</span></p>
            <p><strong>Database:</strong> <span id="db-status">Checking...</span></p>
            <p><strong>Redis:</strong> <span id="redis-status">Checking...</span></p>
        </div>
        
        <div class="info">
            <h3>Quick Actions</h3>
            <button class="button" onclick="startBot()">Start Bot</button>
            <button class="button" onclick="stopBot()">Stop Bot</button>
            <button class="button" onclick="checkStatus()">Refresh Status</button>
        </div>
        
        <div class="info">
            <h3>System Information</h3>
            <p><strong>Environment:</strong> {{ env }}</p>
            <p><strong>Bot Name:</strong> {{ bot_name }}</p>
            <p><strong>Version:</strong> {{ version }}</p>
        </div>
    </div>
    
    <script>
        function checkStatus() {
            fetch('/api/status')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('bot-status').textContent = data.bot_status || 'Unknown';
                    document.getElementById('db-status').textContent = data.database_status || 'Unknown';
                    document.getElementById('redis-status').textContent = data.redis_status || 'Unknown';
                });
        }
        
        function startBot() {
            fetch('/api/start', {method: 'POST'})
                .then(response => response.json())
                .then(data => alert(data.message || 'Bot started'));
        }
        
        function stopBot() {
            fetch('/api/stop', {method: 'POST'})
                .then(response => response.json())
                .then(data => alert(data.message || 'Bot stopped'));
        }
        
        // Check status on page load
        checkStatus();
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE, 
                                env=os.getenv('BOT_ENV', 'development'),
                                bot_name=os.getenv('BOT_NAME', 'RunescapeBot'),
                                version=os.getenv('BOT_VERSION', '1.0.0'))

@app.route('/api/status')
def api_status():
    return jsonify({
        'bot_status': 'Running',
        'database_status': 'Connected',
        'redis_status': 'Connected',
        'environment': os.getenv('BOT_ENV', 'development')
    })

@app.route('/api/start', methods=['POST'])
def api_start():
    return jsonify({'message': 'Bot start command sent'})

@app.route('/api/stop', methods=['POST'])
def api_stop():
    return jsonify({'message': 'Bot stop command sent'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
