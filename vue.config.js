const path = require('path')

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        win: {
          icon: path.resolve(__dirname, 'build', 'icons', 'ico_256.png'),
          artifactName: "${productName}-Setup-${version}.${ext}"
        }
      }
    }
  }
}
