# How to setup in Cloudflare Pages

1. Create a new Cloudflare Page from your git fork
2. Set the build command to `pnpm i` and the page folder to `dist`
3. In _Deployment Settings -> Builds and Deployments_ change _Build System Version_ to __v2__.

# How to setup with Pages + Cloudflare DNS:

1. Build it using the build script in the readme
2. Enable Pages with Github Actions in your repo settings, it's enabled as soon as you open the page
3. On Cloudflare DNS enable Full SSL/TLS mode, not doing so will cause a redirect loop
4. Configure a custom domain by pointing a CNAME to your page domain
5. Run the action. Go to _Actions -> Deploy_ to _Pages -> Run Workflow_
6. Under _Rules -> Transform Rules -> Modify Response Header_ add a New rule with hostname equal to your custom domain and then add:
```
Cross-Origin-Embedder-Policy = require-corp
Cross-Origin-Opener-Policy = same-origin
```