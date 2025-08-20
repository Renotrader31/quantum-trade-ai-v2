module.exports = {
  apps: [{
    name: 'quantum-trade-ai',
    script: 'node_modules/.bin/react-scripts',
    args: 'start',
    cwd: '/home/user/webapp',
    env: {
      NODE_ENV: 'development',
      PORT: 3001,
      BROWSER: 'none'
    },
    watch: false,
    ignore_watch: ['node_modules', '.git'],
    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '300M',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}