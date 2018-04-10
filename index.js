/* eslint-env node */
'use strict';
var BasePlugin = require('ember-cli-deploy-plugin');
var fbTools = require('firebase-tools');

module.exports = {
  name: 'ember-cli-deploy-firebase',

  createDeployPlugin: function(options) {
    var DeployPlugin = BasePlugin.extend({
      name: options.name,

      defaultConfig: {
        projectName: function(context) {
          return context.projectName || context.appName;
        },

        deployToken: function(context) {
          return context.deployToken || process.env.FIREBASE_TOKEN || undefined;
        },

        deployTargets: ['hosting', 'database', 'firestore', 'functions', 'storage']
      },

      upload: function(context) {
        this.log("Starting deploy process...");
        var project = this.readConfig('projectName');
        var build = this.readConfig('outputPath');
        var message = this.readConfig('revisionKey');
        var verbose = context.ui.verbose;
        var token = this.readConfig('deployToken');
        var targets = this.readConfig('deployTargets');
        var options = {
          project: project,
          public: build, //context.config.build.outputPath,
          message: message,
          verbose: verbose,
          token: token
        };
        return fbTools.deploy(targets, options).then(() => {
          this.log('Successful deploy!', { color: green });
        }).catch((err) => {
          this.log('There was an error during deployment:', { color: 'red' });
          this.log(err, { color: 'red' });
          this.log(err.stack, { color: 'red' });
        });
      }
    });

    return new DeployPlugin();
  }
};
