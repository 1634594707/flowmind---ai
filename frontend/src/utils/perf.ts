type PerfMetrics = {
  navStart: number
  domContentLoadedMs?: number
  loadMs?: number
  fcpMs?: number
  lcpMs?: number
}

declare global {
  interface Window {
    __flowmindPerf?: PerfMetrics
  }
}

export const initPerfMetrics = () => {
  if (typeof window === 'undefined' || typeof performance === 'undefined') {
    return
  }

  const navStart = performance.timeOrigin
  const metrics: PerfMetrics = { navStart }
  window.__flowmindPerf = metrics

  const log = (name: string, value: number) => {
    const ms = Math.round(value)
    console.log(`[Perf] ${name}: ${ms}ms`)
  }

  const warnIfOver = (name: string, value: number, thresholdMs: number) => {
    if (value > thresholdMs) {
      console.warn(`[Perf] ${name} over threshold: ${Math.round(value)}ms > ${thresholdMs}ms`)
    }
  }

  const markNavTimings = () => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    if (!nav) {
      return
    }

    metrics.domContentLoadedMs = nav.domContentLoadedEventEnd
    metrics.loadMs = nav.loadEventEnd

    if (metrics.domContentLoadedMs) {
      log('DOMContentLoaded', metrics.domContentLoadedMs)
    }
    if (metrics.loadMs) {
      log('Load', metrics.loadMs)
    }
  }

  // Navigation timings
  try {
    if (document.readyState === 'complete') {
      markNavTimings()
    } else {
      window.addEventListener('load', () => markNavTimings(), { once: true })
    }
  } catch {
    // ignore
  }

  // FCP
  try {
    const poPaint = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.name === 'first-contentful-paint') {
          metrics.fcpMs = e.startTime
          log('FCP', e.startTime)
          warnIfOver('FCP', e.startTime, 2000)
        }
      }
    })
    poPaint.observe({ type: 'paint', buffered: true })
  } catch {
    // ignore
  }

  // LCP
  try {
    const poLcp = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const last = entries[entries.length - 1] as PerformanceEntry | undefined
      if (!last) {
        return
      }
      metrics.lcpMs = last.startTime
      log('LCP', last.startTime)
      warnIfOver('LCP', last.startTime, 2000)
    })
    poLcp.observe({ type: 'largest-contentful-paint', buffered: true })

    const finalize = () => {
      try {
        poLcp.disconnect()
      } catch {
        // ignore
      }
    }

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        finalize()
      }
    })
    window.addEventListener('pagehide', finalize)
  } catch {
    // ignore
  }
}
