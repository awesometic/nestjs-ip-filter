# Documentation Style

## Purpose

Stack-agnostic rules for how Markdown prose is broken into lines; this file owns line breaking and nothing else.
Document language is owned by [ENGINEERING_PRINCIPLES.md](./ENGINEERING_PRINCIPLES.md) → `Readability`.

## Prose Line Breaks

Line breaks in prose carry meaning; they are not a column budget.

Scope: prose in Markdown — `.md` files such as docs, specs, plans, and the provider entry stub — and pull request descriptions.
Commit message bodies are outside this file: their format belongs to whatever commit contract the project documents.

### Precedence

Two rules decide every case, in this order.

1. **A file that already uses hard column wrapping keeps it.** Match that file's existing style for the text you touch. Decide by opening the file, not by where it lives.
2. **Everywhere else, break semantically** — a new file, or a file already written this way.

Never mix the two styles inside one paragraph.

### Semantic Breaking

- There is no maximum line length. Never insert a newline to satisfy a character or column budget.
- Break only at semantic boundaries. In paragraph prose, break after every sentence; optionally before a conjunction, or after `,` `;` `:` when it separates independent clauses. A list item may carry a short sentence pair on one line.
- Never break mid-word, mid-token, or inside inline code, a link target, an emphasis span, or a URL.
- One line is one unit of thought. When a line feels too long, split the sentence itself rather than wrapping it.
- Keep on one line regardless of length: table rows, YAML frontmatter, fenced code blocks, URLs, and badge or image lines.

### Scope Of A Conversion

The unit is the paragraph you actually revise, not the file and not the line.
Reflow that paragraph as the precedence above directs, leave every other paragraph exactly as you found it, and never convert a file's wrapping wholesale as a side effect of an unrelated edit.

### Korean And CJK

- A single newline renders as a space, so break only where a space already exists. Never split an 어절.
- Do not place a line break inside `**...**` or `` `...` `` in Korean text; CommonMark may fail to parse the emphasis.

### Self-Check

Before finishing a Markdown write, run this against the file:

```bash
LC_ALL=en_US.UTF-8 grep -nE '^.{68,92}$' FILE | grep -vE '[.!?:;)"”」』]\s*$'
```

It reports lines in the width band a wrapper would have produced, minus the ones that end a sentence.
Open each reported line and the line after it: if that line continues the same sentence, the pair is a columnar wrap, so join them and re-break at the sentence boundary.

Three limits. The command reads a Latin-script width band, so check Korean and other CJK prose by eye. It does not skip fenced code blocks, so a documented one-liner in the width band reports as a candidate; this file's own example is one. And it is a heuristic rather than a gate: a file legitimately under rule 1 of the precedence above will report many lines, and that is the correct result for it.
