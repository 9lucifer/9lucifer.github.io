import DefaultTheme from 'vitepress/theme'
import PageViewCount from '../components/PageViewCount.vue'
import MyLayout from './MyLayout.vue'

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app, router }) {
    app.component('PageViewCount', PageViewCount)

    if (typeof window !== 'undefined') {
      const loadVercount = () => {
        const old = document.getElementById('vercount-script')
        if (old) old.remove()

        const script = document.createElement('script')
        script.id = 'vercount-script'
        script.async = true
        script.defer = true
        script.src = 'https://cn.vercount.one/js'
        document.head.appendChild(script)
      }

      window.__reloadVercount = loadVercount

      router.onAfterRouteChanged = () => {
        loadVercount()
      }
    }
  }
}
