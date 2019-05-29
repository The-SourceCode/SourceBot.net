// Used by PM2 and made to watch files changes.

module.exports = {
  apps : [{
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    name: 'Sourcebot',
    script: './bin/www',
    instances: 1,
    autorestart: true,
    ignore_watch : ["node_modules", "public", ".git"], // Ignore files from restarting the website if they're modified
    watch: true, // Use an array of files (["app.js", "file..."]) to only watch those files for changes
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'source',
      host : 'local',
      ref  : 'origin/production',
      repo : 'git@github.com:The-SourceCode/sourcebot.net.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
