# Deployment notes

To deploy, run `npm run deploy`, and make sure the `homepage` attribute in package.json is configured to the URL of the deployment target.  
Also, ensure that .env.production has the correct backend URL configured during build time.

CORS rules also need to be updated accordingly for the firebase bucket (Refer: https://stackoverflow.com/questions/37760695/firebase-storage-and-access-control-allow-origin)

Build is generated locally, pushed to the gh-pages repo via the gh-pages npm dev module; netlify then picks it up and hosts it.  
Why aren't we hosting directly on github pages? Because SPA redirects don't work on a directory level.

Currently deployed to https://rajasekar-frontend.netlify.app/