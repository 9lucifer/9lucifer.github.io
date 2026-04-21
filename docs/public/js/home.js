if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  (function () {
    function parseCount(text) {
      const value = Number.parseInt(String(text || '').replace(/[^\d]/g, ''), 10)
      return Number.isFinite(value) ? value : 0
    }

    function formatCount(value) {
      return new Intl.NumberFormat('en-US').format(value)
    }

    function initHomeStats() {
      const pvEl = document.getElementById('vercount_value_site_pv')
      const uvEl = document.getElementById('vercount_value_site_uv')
      const pvBar = document.getElementById('home-stat-progress-pv')
      const uvBar = document.getElementById('home-stat-progress-uv')

      if (!pvEl || !uvEl || !pvBar || !uvBar) {
        setTimeout(initHomeStats, 150)
        return
      }

      const state = {
        pv: 0,
        uv: 0
      }

      function refreshBars() {
        const max = Math.max(state.pv, state.uv, 1)
        pvBar.style.width = `${Math.max((state.pv / max) * 100, 36)}%`
        uvBar.style.width = `${Math.max((state.uv / max) * 100, 28)}%`
      }

      function syncValue(key, el) {
        const value = parseCount(el.textContent)
        if (!value) return

        state[key] = value
        const formatted = formatCount(value)

        if (el.textContent !== formatted) {
          el.textContent = formatted
        }

        refreshBars()
      }

      syncValue('pv', pvEl)
      syncValue('uv', uvEl)

      const observer = new MutationObserver(() => {
        syncValue('pv', pvEl)
        syncValue('uv', uvEl)
      })

      observer.observe(pvEl, { childList: true, characterData: true, subtree: true })
      observer.observe(uvEl, { childList: true, characterData: true, subtree: true })
    }

    function initFeaturesAnimation() {
      const featuresSection = document.querySelector('.VPFeatures')
      const features = document.querySelectorAll('.VPFeature')
      const latestArticles = document.querySelector('.latest-articles')

      if (!featuresSection || features.length < 3 || !latestArticles) {
        setTimeout(initFeaturesAnimation, 100)
        return
      }

      let currentIndex = 0

      function highlightNext() {
        features.forEach((feature) => feature.classList.remove('highlight'))

        if (currentIndex < 3) {
          features[currentIndex].classList.add('highlight')
          currentIndex += 1
          setTimeout(highlightNext, 2000)
        } else {
          featuresSection.classList.add('fade-out')
          latestArticles.classList.add('shift-up')
        }
      }

      setTimeout(highlightNext, 1000)
    }

    function bootHomeEffects() {
      initFeaturesAnimation()
      initHomeStats()
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bootHomeEffects)
    } else {
      bootHomeEffects()
    }
  })()
}
