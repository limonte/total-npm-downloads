const app = new Vue({
  el: '#app',
  data: {
    packageName: '',
    inputValue: '',
    totalDownloads: 0,
    pending: false,
    noResults: false
  },
  computed: {
    showResult: app => app.totalDownloads && !app.noResults && !app.pending,
    showNoResults: app => app.noResults && !app.pending,
    npmjs: app => `https://npmjs.com/package/${app.packageName}`,
    npmstats: app => `https://npm-stat.com/charts.html?package=${app.packageName}`
  },
  methods: {
    submit: () => {
      app.packageName = app.inputValue
      if (app.packageName) {
        app.checkPackage()
        history.replaceState({}, app.updateMetaTitle(app.packageName), `?package=${app.packageName}`)
      }
    },
    checkPackage: () => {
      app.pending = true
      app.getTotalDownloads()
        .then(totalDownloads => {
          app.pending = false
          if (typeof totalDownloads !== 'undefined') {
            app.totalDownloads = totalDownloads
            app.noResults = false
          } else {
            app.noResults = true
          }
        })
    },
    getTotalDownloads: () => {
      return fetch(`https://api.npmjs.org/downloads/point/1970-01-01:2038-01-19/${app.packageName}`)
        .then(response => response.json())
        .then(data => data.downloads)
    },
    updateMetaTitle: () => {
      document.title = 'Total npm downloads' + (app.packageName ? ` of ${app.packageName}` : '')
      return document.title
    }
  }

})

// init package name from query string if provided
if (location.search && location.search.match(/package=(.+)/)) {
  app.inputValue = location.search.match(/package=(.+)/)[1]
  app.submit()
}
