module.exports = {
  apps: [
    {
      name: "midad-academy",
      script: "server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 8080,
        SUPABASE_URL: "https://bvmztjljiumjsvejudgi.supabase.co",
        SUPABASE_KEY: "sb_publishable_9XRWjwc3lMh9EeTCE-YwTQ_uuKUdDsw"
      }
    }
  ]
};
