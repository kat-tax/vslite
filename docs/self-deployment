# How to setup in CloudFlare Pages

1. Create a new Cloudflare Page from your git fork
2. Set the build command to `pnpm i` and the page folder to dist
3. In Deployment Settings -> BUilds and deployments. Change Build System version to v2

# How to setup with Pages + CloudFlare DNS:

1. build it using the build script on the readme
2. Enable Pages with Github actions in your repo settings, it's enabled as soon as you open the page
3. On cloudflare DNS enable full SSL/TLS mode, not doing so will cause a redirect loop
4. Configure a custom domain by pointing a CNAME to your page domain
5. Run the action. Go to Actions -> Deploy to Pages -> Run Workflow
6. Under Rules -> Transform Rules -> Modify Response Header add a New rule with Hostname equals your custom domain and Then... add Cross-Origin-Embedder-Policy = require-corp and Cross-Origin-Opener-Policy = same-origin
