const DEFAULT_CREDENTIALS = { user: 'erin', superUser: 'rebecca', adminUser: 'arthur' }

class Page {
    open(pathName = '/', credentials = DEFAULT_CREDENTIALS.user) {
        const urlToGet = `${browser.options.baseUrl}${pathName}?user=${credentials}&pass=${credentials}`
        browser.url(urlToGet)
    }

    openAsSuperUser(pathName = '/') {
        const credentials = DEFAULT_CREDENTIALS.superUser
        const urlToGet = `${browser.options.baseUrl}${pathName}?user=${credentials}&pass=${credentials}`
        browser.url(urlToGet)
    }

    openAsAdminUser(pathName = '/') {
      const credentials = DEFAULT_CREDENTIALS.adminUser
      const urlToGet = `${browser.options.baseUrl}${pathName}?user=${credentials}&pass=${credentials}`
      browser.url(urlToGet)
  }
}

export default Page