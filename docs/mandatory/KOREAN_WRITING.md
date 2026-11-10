# Korean Writing

## Purpose

Stack-agnostic rules for producing natural Korean text — a response, a document, or any other prose the reader sees in Korean.

Read every section before you write Korean, once, while the file is in front of you; the part you skip is the part that goes unenforced, and recall, skimming, or searching it for one term is not a read.
Write this way from the start; this is not a post-editing pass.
Korean translated from an English draft is polished afterwards per [AGENTS.md](../../AGENTS.md) → `Copy Pipeline`, and these rules bind the final text either way, closed by `Self-Check` below.
Where a skill applies occurrence thresholds to Korean, a form banned here is removed even at one occurrence.

The target is Korean that sounds natural read aloud, the way a colleague talks.

Product surfaces — UI copy, error and empty-state messages, store listings — follow the vocabulary and grammar rules below.
Their voice, register, and length are a product decision owned by `PRODUCT.md` and `DESIGN.md` through the design skill ([PROVIDER_HARNESS.md](./PROVIDER_HARNESS.md) → `Impeccable Operating Mode`), and where a design system states a copy contract it wins over anything here — including the 존댓말 floor, which governs how you address the operator and not how a product addresses its users.
Within a product surface, the line that matters for the rhythm rules is microcopy against prose, not product against document.
Microcopy — a button or field label, a toast, a one-line empty state, an error string — is too short to have rhythm, so those rules do not reach it.
Prose on a product surface is prose: a FAQ answer, an onboarding explanation, a help article, terms and privacy text, release notes. The rhythm rules apply there exactly as they do in a report.

Response tone, structure, and formatting are owned by [AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md) → `Final Response Expectations`; inside a document, formatting follows the surrounding document and line breaking follows [DOCUMENTATION_STYLE.md](./DOCUMENTATION_STYLE.md).

Adapted from [im-not-ai](https://github.com/epoko77-ai/im-not-ai) `skills/humanize-korean/references/quick-rules.md` (MIT; notice in [THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md)). Most of upstream's occurrence thresholds are stated here as absolutes, because this file governs prose as it is written rather than a draft to score.

## Principles

- 존댓말 is the floor, set by [AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md) → `Final Response Expectations`. Above that floor, match the operator's register and keep it consistent within one response; never raise formality further on your own (no -했- → -하였-).
- Keep proper nouns, numbers, and code identifiers verbatim. `Technical Vocabulary` below owns every other term of art.
- Sino-Korean is not itself the problem. Words developers say out loud — 설정, 배포, 함수, 검증 — are fine. The target is bureaucratic vocabulary that exists only on paper.

## Technical Vocabulary

Write the term Korean engineering practice already uses.
Which form that is varies term by term: sometimes a transliteration (폴백, 베이스라인), sometimes a Korean word (배포, 경쟁 상태, 교착 상태), sometimes the English kept as-is (shadowing, guardrail).
All three are fine; minting a rendering yourself is not.

- Never coin a rendering practice does not already use. Writing "바닥선" where an engineer writes "베이스라인" forces the reader to translate backwards into the term they already knew.
- The test is domain usage, not whether the word exists. "사문화" is real Korean and wrong here; engineering Korean has no term for it, so the sentence gets described plainly instead — "구속력이 없는 문장".
- Where a literal translation reads badly, carry the meaning rather than the words. A fresh context is 새 컨텍스트 and a fresh run is one you 다시 돌립니다, never 신선한 — that word is for food. This exit is always available whenever no existing form fits.
- When you cannot tell which form practice uses, use the English original, explaining its meaning in plain Korean when the reader needs it. Never resolve the doubt by inventing.
- This section governs what a concept is called. It does not reopen `Written-Only Sino-Korean`, whose list is closed and wins for every form it names.

On a product surface the reader is not an engineer, so neither an unglossed English term nor a transliteration only engineers know belongs there; describe the thing in plain Korean, subject to the design system's copy contract.

## Written-Only Sino-Korean

Never write the left form; use the right one.

- 수행하다·실시하다 → 하다, 돌리다, 진행하다
- 존재하다 / 부재하다 → 있다 / 없다
- 발생하다 → 생기다, 나다 (에러가 나다)
- 소요되다 → 걸리다
- 완료하였다 → 끝냈다, 마쳤다
- 상이하다 / 동일하다 → 다르다 / 같다
- 용이하다 → 쉽다
- 해당 파일 → 그 파일, 이 파일
- 명시하다·기재하다 → 적다, 밝히다
- 도출하다 → 얻다, 끌어내다
- 야기하다·초래하다 → 일으키다, 만들다
- 활용하다 → 쓰다
- 제공하다 → 주다, 내놓다
- 취합하다 → 모으다
- 일괄 → 한꺼번에
- 상기 / 하기 → 위 / 아래
- 금일 / 익일 → 오늘 / 다음 날
- 지양하다 → 피하다, 하지 않다
- 필수적이다 → 꼭 필요하다
- 성공 여부 → 성공했는지
- 실패 시 → 실패하면, 실패할 때
- 미지원 → 지원하지 않음

## No Translation-Ese

- Do not repeat "~에 대해"; connect with the object particle instead (X에 대해 설명 → X를 설명).
- Use "~를 통해" at most once per response; prefer "~로" or "~해서".
- Never "~에 있어(서)"; use "~에서".
- Never "가지고 있다", and do not render the other English light verbs (have/make/take/give + a noun) literally either; reduce to the verb or a double-subject form (경쟁력을 가지고 있다 → 경쟁력이 강하다, 위원회가 결정을 만들었다 → 위원회가 결정했다, 회의를 가졌다 → 회의를 했다).
- Never double passive (판단되어진다 → 판단된다).
- Put the agent in subject position instead of "~에 의해" (AI에 의해 생성된 → AI가 만든).
- Do not overuse "~할 수 있다"; state facts plainly (높일 수 있습니다 → 높입니다).
- Never stack particles as "~에서의" or "~으로의"; unfold them into a clause.
- Do not repeat "그, 그녀, 그들"; drop the subject or use the name.
- When a noun carries a modifier chain of three or more words, split the sentence.
- Do not stack "-적, -성, -화" (전략적 함의 → 전략 함의, 최적화를 진행 → 최적화한다).

## No Over-Hedging

Hedge because the evidence is thin, never because a plain sentence feels too bold.

- Drop a speculative ending — "~로 보인다", "~로 판단된다", "~라고 여겨진다", "~인 듯하다" — wherever you can simply assert. State what you checked.
- Never stack hedges. "~할 가능성이 있을 수 있다" and "~로 보여질 수 있다" spend three words carrying one hedge's meaning; keep one.
- Do not reach for balance vocabulary — "양쪽 모두", "장점도 있지만", "신중하게", "균형" — as a way to avoid committing. Give the comparison, or name the condition under which each side holds.

Saying plainly what you did not verify is required and is not hedging: "확인하지 않았습니다" is a fact; "확인되지 않은 것으로 보입니다" is a hedge wrapped around one.

## No AI Idioms

- The top rule: never put a comma right after a connective ending (-고, -며, -지만, -면서, -아서/-어서). A mid-list "-하고," "-했고," or "-이지만," is the strongest single AI tell in Korean. Drop the comma or split the sentence (확인하고, 수정했다 → 확인하고 수정했다).
- Never add a scene, a metaphor, or a stock phrase the material did not give you. Scene in an internal source document, such as a positioning statement or design rationale, does not carry over to text an outside reader sees; scene in the shipped English source is the design contract's voice decision and translates.
- Never write "결론적으로", "요약하자면", "시사하는 바가 크다", or "주목할 만하다".
- No enumeration openers such as "크게 세 가지로 나눌 수 있습니다" or "다음과 같습니다"; go straight to the point.
- No mechanical "첫째, 둘째, 셋째"; vary with "우선, 이어서, 마지막으로" or fold the list into prose.
- Sentence-initial connectives (또한, 따라서, 즉, 나아가, 아울러): at most one or two per response. Sequence markers for steps (우선, 이어서, 마지막으로) are outside this cap.
- No hype words (혁신적, 획기적, 압도적, 전례 없는); use concrete numbers and facts.
- The antithesis-parallel formula — "A인가, B인가", "A가 아니라 B" — at most once per response or document; recast a second occurrence as an asymmetric plain statement.
- Do not end sentences repeatedly with "~한 것입니다" or "~다는 뜻입니다"; end with a plain "~합니다".
- Do not spam "~해야 합니다" recommendations; name the actor and the condition.

## Rhythm

- Vary sentence length; mix short and long sentences.
- No repeated em-dash (—) asides.
- Quotation marks quote. A speaker's words keep them, and a concept term may take them once at first mention; quotes as recurring emphasis or decoration are removed.
- Vary sentence endings as well as lengths: the same 종결어미 four sentences in a row reads as machine rhythm. Vary within the register; the 존댓말 floor never drops for it.
- No "X: Y" colon-subtitle headings, where the part after the colon is decoration. A heading that is genuinely structural keeps its shape — a report's section title, a FAQ's question, a changelog's version line.

## Self-Check

Before sending Korean text, confirm three things.

1. Read it aloud: is there a word you would never say in speech?
2. Zero occurrences of a double passive, "가지고 있다", "결론적으로", a stacked hedge, a comma after a connective ending, or a metaphor or scene you added that the material did not have.
3. Register is consistent; technical terms, numbers, and proper nouns are intact; and every term naming a technical concept is one an engineer would recognize, not one you rendered into Korean yourself.
