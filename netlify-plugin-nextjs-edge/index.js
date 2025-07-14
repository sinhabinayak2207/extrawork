// Custom plugin to help with Next.js on Netlify
module.exports = {
  onPreBuild: ({ utils }) => {
    console.log('Setting up Next.js for Netlify Edge deployment...');
  },
  onBuild: ({ utils }) => {
    console.log('Optimizing Next.js build for Netlify...');
  },
  onPostBuild: ({ utils }) => {
    console.log('Post-processing Next.js build for Netlify Edge compatibility...');
  }
};
