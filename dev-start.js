#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting all development servers...\n');

const projects = [
  {
    name: 'Portfolio Website',
    path: 'website',
    command: 'npm',
    args: ['run', 'dev'],
    port: 3000
  },
  {
    name: 'Productivity Bingo',
    path: 'bingo',
    command: 'npm',
    args: ['run', 'dev'],
    port: 3001
  },
  {
    name: 'Body Double App',
    path: 'projects/body-double-app/body-double-app/app',
    command: 'npm',
    args: ['run', 'dev:all'],
    port: 3002
  },
  {
    name: 'Baby Tracker',
    path: 'baby',
    command: 'npm',
    args: ['run', 'dev'],
    port: 3003
  },
  {
    name: 'Neighborhood App',
    path: 'neighborhood-app',
    command: 'npm',
    args: ['run', 'dev'],
    port: 3004
  },
  {
    name: 'Maintenance Tracker',
    path: 'maintenance-tracker',
    command: 'npm',
    args: ['run', 'dev'],
    port: 3005
  }
];

// Start each project
projects.forEach((project, index) => {
  setTimeout(() => {
    console.log(`📦 Starting ${project.name} on port ${project.port}...`);
    
    const child = spawn(project.command, project.args, {
      cwd: path.join(__dirname, project.path),
      stdio: 'inherit',
      shell: true
    });

    child.on('error', (error) => {
      console.error(`❌ Error starting ${project.name}:`, error.message);
    });

    child.on('close', (code) => {
      if (code !== 0) {
        console.log(`⚠️  ${project.name} exited with code ${code}`);
      }
    });
  }, index * 2000); // Stagger starts by 2 seconds
});

console.log('\n✨ All projects are starting up!');
console.log('\n📋 Available URLs:');
projects.forEach(project => {
  console.log(`   ${project.name}: http://localhost:${project.port}`);
});
console.log('\n💡 Press Ctrl+C to stop all servers');








