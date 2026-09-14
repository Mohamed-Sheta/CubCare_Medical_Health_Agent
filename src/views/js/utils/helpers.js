// General utility helpers
export const Helpers = {
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  formatDate(dateStr) {
    if (!dateStr) return 'Just now';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  },

  formatTime(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  },

  renderMarkdown(text) {
    if (!text) return '';
    let parsed = this.escapeHtml(text);

    // Code blocks ```code```
    parsed = parsed.replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>');

    // Inline code `code`
    parsed = parsed.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Bold **text**
    parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic *text*
    parsed = parsed.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Bullet points (- or * )
    parsed = parsed.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
    parsed = parsed.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul class="chat-bullet-list">$1</ul>');

    // Numbered lists (1. )
    parsed = parsed.replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li value="$1">$2</li>');

    // Line breaks
    parsed = parsed.replace(/\n/g, '<br>');

    return parsed;
  }
};
