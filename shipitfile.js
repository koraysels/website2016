module.exports = shipit => {
    require('shipit-deploy')(shipit);
    const path = require('path');

    shipit.initConfig({
        default: {
            deployTo: '/home/undefined/app/weareundefined.be',
            repositoryUrl: 'https://github.com/undefinedio/website2016',
            workspace: './',
        },
        production: {
            servers: 'undefined@178.18.136.201',
        },
    });

    shipit.on('published', () => {
        const publicFolder = path.join(shipit.currentPath, '/dist/');

        return shipit.remoteCopy('dist/', publicFolder)
            .then(() => {
                shipit.log('dist folder copied to server.');
            });
    });
};