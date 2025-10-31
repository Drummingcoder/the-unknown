#!/usr/bin/env python3
import os
import sys
import time
import subprocess
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

HACKATIME_API_KEY = os.getenv('HACKATIME_API_KEY')
HACKATIME_API_URL = 'https://hackatime.hackclub.com/api'
PROJECT_NAME = os.getenv('REPL_SLUG', 'replit-project')

class CodeActivityHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_heartbeat = {}
        
    def send_heartbeat(self, file_path):
        now = time.time()
        
        if file_path in self.last_heartbeat:
            if now - self.last_heartbeat[file_path] < 120:
                return
        
        self.last_heartbeat[file_path] = now
        
        abs_path = os.path.abspath(file_path)
        
        cmd = [
            'wakatime',
            '--entity', abs_path,
            '--plugin', 'replit-wakatime/1.0.0',
            '--project', PROJECT_NAME,
        ]
        
        try:
            subprocess.run(cmd, capture_output=True, timeout=5)
            print(f"✓ Heartbeat sent for: {os.path.basename(file_path)}")
        except Exception as e:
            print(f"✗ Failed to send heartbeat: {e}", file=sys.stderr)
    
    def on_modified(self, event):
        if event.is_directory:
            return
        
        file_path = event.src_path
        
        if any(skip in file_path for skip in ['.git/', '__pycache__/', 'node_modules/', '.cache/']):
            return
        
        if file_path.endswith(('.py', '.js', '.ts', '.jsx', '.tsx', '.html', '.css', 
                              '.json', '.md', '.yml', '.yaml', '.toml', '.sh')):
            self.send_heartbeat(file_path)

def setup_config():
    config_path = Path.home() / '.wakatime.cfg'
    
    if not HACKATIME_API_KEY:
        print("ERROR: HACKATIME_API_KEY not found in environment", file=sys.stderr)
        sys.exit(1)
    
    config_content = f"""[settings]
api_key = {HACKATIME_API_KEY}
api_url = {HACKATIME_API_URL}
"""
    
    config_path.write_text(config_content)
    print(f"✓ Config written to {config_path}")

def main():
    print("🚀 Starting Hackatime tracker for Replit...")
    
    setup_config()
    
    project_dir = os.getcwd()
    print(f"📁 Watching directory: {project_dir}")
    print(f"📊 Project: {PROJECT_NAME}")
    print(f"🔗 API endpoint: {HACKATIME_API_URL}")
    print(f"⏱️  Heartbeat interval: 2 minutes\n")
    
    event_handler = CodeActivityHandler()
    observer = Observer()
    observer.schedule(event_handler, project_dir, recursive=True)
    observer.start()
    
    print("✅ Tracker running! Your coding time is being tracked.\n")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping Hackatime tracker...")
        observer.stop()
    
    observer.join()

if __name__ == "__main__":
    main()
