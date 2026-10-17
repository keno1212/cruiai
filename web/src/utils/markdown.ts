// 极简 markdown 渲染：支持 #/##/### 标题、- 列表、**粗体**、`代码`。
// 用于文章正文展示，无需引入额外依赖。
export function renderMarkdown(md: string): string {
  const lines = (md || '').split('\n')
  let html = ''
  let inList = false
  const closeList = () => {
    if (inList) {
      html += '</ul>'
      inList = false
    }
  }
  for (const raw of lines) {
    const h = raw.match(/^(#{1,3})\s+(.*)$/)
    if (h) {
      closeList()
      const lvl = h[1].length
      html += `<h${lvl} class="md-h${lvl}">${inline(h[2])}</h${lvl}>`
      continue
    }
    if (/^\s*[-*]\s+/.test(raw)) {
      if (!inList) {
        html += '<ul class="md-ul">'
        inList = true
      }
      html += `<li>${inline(raw.replace(/^\s*[-*]\s+/, ''))}</li>`
      continue
    }
    closeList()
    if (raw.trim() === '') continue
    html += `<p class="md-p">${inline(raw)}</p>`
  }
  closeList()
  return html
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inline(s: string): string {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code class="md-code">$1</code>')
}
