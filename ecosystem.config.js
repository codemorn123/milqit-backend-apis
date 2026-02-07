module.exports = {
    apps: [
        {
            name: 'milqit-backend',
            script: 'build/server.js', // Using server.js as it contains the app.listen() call
            watch: true,
            ignore_watch: ['node_modules', 'logs', 'uploads'],
            env: {
                NODE_ENV: 'development',
                PORT: 5001,
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 5001,
            },
        },
    ],
};
