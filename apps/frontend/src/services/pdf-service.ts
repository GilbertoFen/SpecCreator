import { GeneratedSpec, orderedSections, sectionLabels } from '@/types/spec';

type FontName = 'F1' | 'F2' | 'F3';

type PdfLine = {
  font: FontName;
  indent: number;
  size: number;
  text: string;
};

function escapePdfText(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapText(text: string, maxChars: number) {
  if (text.length <= maxChars) {
    return [text];
  }

  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (candidate.length <= maxChars) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function createWrappedLines(
  text: string,
  options: { font: FontName; indent?: number; maxChars?: number; size: number },
) {
  const indent = options.indent ?? 0;
  const maxChars = options.maxChars ?? 80;

  return wrapText(text, maxChars).map(
    (line): PdfLine => ({
      font: options.font,
      indent,
      size: options.size,
      text: line,
    }),
  );
}

function buildDocumentLines(spec: GeneratedSpec, description?: string) {
  const lines: Array<PdfLine | null> = [];

  lines.push({ font: 'F2', indent: 0, size: 20, text: 'Especificacion Tecnica' });
  lines.push({ font: 'F3', indent: 0, size: 10, text: 'Documento generado desde Spec Creator' });
  lines.push(null);

  if (description?.trim()) {
    lines.push({ font: 'F2', indent: 0, size: 13, text: 'Descripcion base' });
    lines.push(
      ...createWrappedLines(description.trim(), {
        font: 'F1',
        size: 11,
        maxChars: 88,
      }),
    );
    lines.push(null);
  }

  orderedSections.forEach((sectionKey, index) => {
    const section = spec[sectionKey];

    lines.push({
      font: 'F2',
      indent: 0,
      size: 13,
      text: `${index + 1}. ${sectionLabels[sectionKey]}`,
    });
    lines.push(
      ...createWrappedLines(section.title, {
        font: 'F3',
        size: 11,
        maxChars: 88,
      }),
    );

    section.content.forEach((item) => {
      lines.push(
        ...createWrappedLines(`- ${item}`, {
          font: 'F1',
          indent: 14,
          size: 11,
          maxChars: 82,
        }),
      );
    });

    if (index < orderedSections.length - 1) {
      lines.push(null);
    }
  });

  return lines;
}

function buildPdfObjects(pages: string[]) {
  const pageObjectIds = pages.map((_, index) => 6 + index * 2);
  const contentObjectIds = pages.map((_, index) => 7 + index * 2);
  const objects: string[] = [];
  const kids = pageObjectIds.map((id) => `${id} 0 R`).join(' ');

  objects.push('1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj');
  objects.push(`2 0 obj << /Type /Pages /Count ${pages.length} /Kids [${kids}] >> endobj`);
  objects.push('3 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj');
  objects.push('4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj');
  objects.push('5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >> endobj');

  pages.forEach((page, index) => {
    const pageId = pageObjectIds[index];
    const contentId = contentObjectIds[index];

    objects.push(
      `${pageId} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${contentId} 0 R >> endobj`,
    );

    objects.push(
      `${contentId} 0 obj << /Length ${page.length} >> stream\n${page}\nendstream endobj`,
    );
  });

  return objects;
}

function createPageContent(lines: Array<PdfLine | null>) {
  const top = 790;
  let y = top;
  const commands: string[] = [];

  lines.forEach((line) => {
    if (!line) {
      y -= 12;
      return;
    }

    const x = 52 + line.indent;
    commands.push('BT');
    commands.push(`/${line.font} ${line.size} Tf`);
    commands.push(`1 0 0 1 ${x} ${y} Tm`);
    commands.push(`(${escapePdfText(line.text)}) Tj`);
    commands.push('ET');
    y -= Math.max(line.size + 5, 16);
  });

  return commands.join('\n');
}

export function downloadSpecAsPdf(
  filename: string,
  title: string,
  spec: GeneratedSpec,
  description?: string,
) {
  const bottomMargin = 58;
  const lines = buildDocumentLines(spec, description);
  const pages: Array<Array<PdfLine | null>> = [];
  let currentPage: Array<PdfLine | null> = [];
  let remainingHeight = 790 - bottomMargin;

  lines.forEach((line) => {
    const estimatedHeight = line ? Math.max(line.size + 5, 16) : 12;

    if (remainingHeight - estimatedHeight < 0 && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
      remainingHeight = 790 - bottomMargin;
    }

    currentPage.push(line);
    remainingHeight -= estimatedHeight;
  });

  if (currentPage.length === 0) {
    currentPage.push({ font: 'F1', indent: 0, size: 11, text: '' });
  }

  pages.push(currentPage);

  const pageStreams = pages.map((pageLines, index) => {
    const footer = [
      null,
      {
        font: 'F3' as const,
        indent: 0,
        size: 9,
        text: `Pagina ${index + 1} de ${pages.length}`,
      },
    ];

    return createPageContent([...pageLines, ...footer]);
  });

  const documentTitle = escapePdfText(title);
  const objects = buildPdfObjects(pageStreams);
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
    'xref',
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
