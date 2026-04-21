import DefaultTheme from 'vitepress/theme'
import PageViewCount from '../components/PageViewCount.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('PageViewCount', PageViewCount)

    if (typeof window !== 'undefined') {
      const loadVercount = () => {
        window.clearTimeout(window.__vercountTimer)
        window.__vercountTimer = window.setTimeout(() => {
          const old = document.getElementById('vercount-script')
          if (old) old.remove()

          const script = document.createElement('script')
          script.id = 'vercount-script'
          script.defer = true
          script.src = 'https://cn.vercount.one/js'
          document.head.appendChild(script)
        }, 120)
      }

      window.__reloadVercount = loadVercount

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadVercount, { once: true })
      } else {
        loadVercount()
      }

      router.onAfterRouteChanged = () => {
        loadVercount()
      }
    }
  }
}
