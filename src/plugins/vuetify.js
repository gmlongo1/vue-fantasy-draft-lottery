import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        themes: {
          light: {
            primary: '#2196F3',
            secondary: colors.grey.darken3,
            accent: '#2196F3',
            error: colors.red.accent3,
          },
          dark: {
            primary: '#2196F3',
          },
        },
      }
    /*theme: {
        primary: '#000',
        secondary: '#2196F3',
        accent: colors.yellow.lighten1,
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
    }*/
})
