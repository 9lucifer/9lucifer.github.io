import DefaultTheme from 'vitepress/theme'
import PageViewCount from '../components/PageViewCount.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('PageViewCount', PageViewCount)

    if (typeof window !== 'undefined') {
      const loadVercount = () => {
        const old = document.getElementById('vercount-script')
        if (old) old.remove()

        const script = document.createElement('script')
        script.id = 'vercount-script'
        script.defer = true
        script.src = 'https://events.vercount.one/js'
        document.head.appendChild(script)
      }

      router.onAfterRouteChanged = () => {
        loadVercount()
      }
    }
  }
}
