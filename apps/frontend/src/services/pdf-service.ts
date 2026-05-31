function escapePdfText(text: string) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapLine(text: string, maxChars = 92) {
  if (text.length <= maxChars) {
    return [text];
  }

  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (candidate.length > maxChars) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        lines.push(word.slice(0, maxChars));
        currentLine = word.slice(maxChars);
      }
    } else {
      currentLine = candidate;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function buildPdfObjects(pages: string[]) {
  const pageObjectIds = pages.map((_, index) => 4 + index * 2);
  const contentObjectIds = pages.map((_, index) => 5 + index * 2);
  const objects: string[] = [];
  const kids = pageObjectIds.map((id) => `${id} 0 R`).join(' ');

  objects.push('1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj');
  objects.push(`2 0 obj << /Type /Pages /Count ${pages.length} /Kids [${kids}] >> endobj`);
  objects.push('3 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj');

  pages.forEach((page, index) => {
    const pageId = pageObjectIds[index];
    const contentId = contentObjectIds[index];

    objects.push(
      `${pageId} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >> endobj`,
    );

    objects.push(
      `${contentId} 0 obj << /Length ${page.length} >> stream\n${page}\nendstream endobj`,
    );
  });

  return objects;
}

export function downloadPdfFromText(filename: string, title: string, text: string) {
  const lineHeight = 16;
  const top = 790;
  const bottom = 56;
  const maxLinesPerPage = Math.floor((top - bottom) / lineHeight);
  const rawLines = text
    .split('\n')
    .flatMap((line) => (line.trim() ? wrapLine(line) : ['']));
  const pages: string[] = [];

  for (let pageStart = 0; pageStart < rawLines.length; pageStart += maxLinesPerPage) {
    const pageLines = rawLines.slice(pageStart, pageStart + maxLinesPerPage);
    const content = ['BT', '/F1 11 Tf', `50 ${top} Td`];

    pageLines.forEach((line, index) => {
      const escaped = escapePdfText(line);

      if (index === 0) {
        content.push(`(${escaped}) Tj`);
      } else {
        content.push(`0 -${lineHeight} Td`);
        content.push(`(${escaped}) Tj`);
      }
    });

    content.push('ET');
    pages.push(content.join('\n'));
  }

  const documentTitle = escapePdfText(title);
  const objects = buildPdfObjects(pages.length > 0 ? pages : ['BT /F1 11 Tf 50 790 Td () Tj ET']);
  const header = '%PDF-1.4\n';
  let body = '';
  let offset = header.length;
  const xrefOffsets = [0];

  for (const object of objects) {
    xrefOffsets.push(offset);
    body += `${object}\n`;
    offset = header.length + body.length;
  }

  const xrefStart = header.length + body.length;
  const xref = [
    `xref`,
    `0 ${objects.length + 1}`,
    '0000000000 65535 f ',
    ...xrefOffsets.slice(1).map((value) => `${String(value).padStart(10, '0')} 00000 n `),
  ].join('\n');

  const trailer = [
    'trailer',
    `<< /Size ${objects.length + 1} /Root 1 0 R /Info << /Title (${documentTitle}) >> >>`,
    'startxref',
    `${xrefStart}`,
    '%%EOF',
  ].join('\n');

  const pdf = `${header}${body}${xref}\n${trailer}`;
  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}
