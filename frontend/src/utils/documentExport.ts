const escapeHtml = (input: string) => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const toFileName = (title: string, ext: string) => {
  const base = (title || 'document').trim().replace(/[\\/:*?"<>|]+/g, '_')
  return `${base}.${ext}`
}

const markdownToHtml = (markdown: string) => {
  const escaped = escapeHtml(markdown || '')
  const lines = escaped.split(/\r?\n/)

  const blocks: string[] = []
  let inCode = false
  let codeLines: string[] = []

  const flushCode = () => {
    if (!codeLines.length) {
      return
    }
    const code = codeLines.join('\n')
    blocks.push(`<pre style="background:#111827;color:#f9fafb;padding:12px;border-radius:8px;overflow:auto;"><code>${code}</code></pre>`)
    codeLines = []
  }

  const inline = (s: string) => {
    return s
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+?)`/g, '<code style="background:#e5e7eb;padding:2px 4px;border-radius:4px;">$1</code>')
  }

  for (const rawLine of lines) {
    const line = rawLine

    if (line.trim().startsWith('```')) {
      if (inCode) {
        inCode = false
        flushCode()
      } else {
        inCode = true
      }
      continue
    }

    if (inCode) {
      codeLines.push(line)
      continue
    }

    const h1 = line.match(/^#\s+(.+)$/)
    if (h1) {
      blocks.push(`<h1 style="font-size:24px;margin:16px 0 8px;font-weight:700;">${inline(h1[1])}</h1>`)
      continue
    }

    const h2 = line.match(/^##\s+(.+)$/)
    if (h2) {
      blocks.push(`<h2 style="font-size:18px;margin:14px 0 6px;font-weight:700;">${inline(h2[1])}</h2>`)
      continue
    }

    const h3 = line.match(/^###\s+(.+)$/)
    if (h3) {
      blocks.push(`<h3 style="font-size:14px;margin:12px 0 6px;font-weight:700;">${inline(h3[1])}</h3>`)
      continue
    }

    const ul = line.match(/^[-*]\s+(.+)$/)
    if (ul) {
      blocks.push(`<div style="margin:4px 0 4px 18px;">• ${inline(ul[1])}</div>`)
      continue
    }

    if (!line.trim()) {
      blocks.push('<div style="height:8px;"></div>')
      continue
    }

    blocks.push(`<p style="margin:6px 0;line-height:1.6;">${inline(line)}</p>`)
  }

  if (inCode) {
    flushCode()
  }

  return blocks.join('')
}

export const exportDocumentAsWord = (title: string, markdown: string) => {
  const body = markdownToHtml(markdown)
  const html = `<!doctype html><html><head><meta charset="utf-8" /><title>${escapeHtml(title)}</title></head><body>${body}</body></html>`
  const blob = new Blob([html], { type: 'application/msword;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = toFileName(title, 'doc')
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export const exportDocumentAsPdf = (title: string, markdown: string) => {
  const body = markdownToHtml(markdown)
  const html = `<!doctype html><html><head><meta charset="utf-8" /><title>${escapeHtml(title)}</title></head><body>${body}</body></html>`
  const w = window.open('', '_blank')
  if (!w) {
    throw new Error('Popup blocked')
  }
  w.document.open()
  w.document.write(html)
  w.document.close()
  w.focus()
  w.print()
}
