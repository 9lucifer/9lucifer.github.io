import DefaultTheme from 'vitepress/theme'
import XMindViewer from './../components/XMindViewer.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('x-mind-viewer', XMindViewer)
    app.component('XMindViewer', XMindViewer)
  }
}
