import DefaultTheme from 'vitepress/theme'
import XMindViewer from '../components/XMindViewer.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('XMindViewer', XMindViewer)
  }
}