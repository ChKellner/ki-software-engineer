---
name: requirements-interview
description: Interview the user step-by-step to clarify a rough feature idea, then create a template-based issue with a user story, Given/When/Then acceptance criteria, and technical notes. Use before tests and implementation when goals, constraints, or scope need clarification; do not restart discovery for an already agreed specification.
---

# Requirements interview

Turn a rough idea into a complete issue that the user and implementing agent understand the same way. Invoke with
`$requirements-interview` and an idea, or begin by asking what feature or problem the user wants to explore.

## Identify the issue destination and template

Reuse any issue tracker, repository, and template already specified by the user. Inspect local issue templates such as
`.github/ISSUE_TEMPLATE/` and `.github/ISSUE_TEMPLATE.md`; when the target repository differs, inspect its templates
through available read access. Prefer the user's chosen template, otherwise the applicable feature or requirement
template. If several templates fit and the choice affects required content, clarify it during the interview.

If no applicable template exists, use [assets/user-story-template.md](assets/user-story-template.md) as the issue
template. Do not create or modify repository-wide templates as part of the interview. For a custom template, preserve
its required sections or form fields and map the story, acceptance criteria, and technical notes into them. Add these
sections when the template allows it; clarify any incompatibility rather than silently dropping required content.

Establish the target repository or project during the interview if it cannot be determined from the task context and
repository configuration. The local repository is a candidate, not permission to publish in an unrelated project.
An explicitly requested draft-only interview ends with the completed issue content rather than publication.

## Conduct the interview

Read the available conversation first and reuse answers already given. When repository context affects feasibility,
read applicable agent guidance and inspect relevant documentation or source without making changes. Existing behavior
is context, not evidence that the user wants to preserve it.

Ask one focused question at a time, wait for the answer, and use it to choose the next question. Do not send the full
questionnaire at once or answer on the user's behalf. Use an available clarification tool when appropriate; otherwise
ask in chat. Offer short choices when they help, while allowing the user to describe a different answer.

Work through the following topics in order, skipping what is already clear and revisiting earlier answers when needed:

1. **Goal and user:** Who needs this, what problem do they face, and what observable outcome would make it successful?
2. **Core behavior:** What triggers the feature, what does the user do, and what result should they see? Ask for a concrete
   example when terms such as "fast", "easy", or "better" leave expected behavior ambiguous.
3. **Scope:** What belongs in the smallest useful version, what is explicitly excluded, and which variants are essential?
4. **Constraints:** Clarify relevant platform, data, integration, compatibility, accessibility, privacy, performance,
   deadline, or dependency constraints. Explore only those that could change this feature's requirements.
5. **Boundaries and failures:** Clarify relevant loading, empty, invalid-input, missing-record, permission, and failure
   behavior. Ask about cancellation or concurrency when it changes the expected outcome.

Keep a compact working summary of decisions and open questions. Reflect it back at meaningful scope changes to catch
misunderstandings. Resolve conflicting answers explicitly rather than silently choosing one. Separate user decisions,
verified repository facts, proposed approaches, and assumptions.

Do not invent requirements, metrics, deadlines, or technical commitments. If the user cannot decide, explain the
tradeoff and record the uncertainty. If asked to stop the interview early, produce a draft with unresolved questions
instead of presenting it as ready for implementation.

## Prepare the issue

Once the actor, outcome, scope, important constraints, and observable behavior are clear, read the selected template and
fill it with the interview results. Use the user's language for the issue title and body while retaining Given/When/Then
keywords. Replace placeholders, repeat the scenario block for each agreed criterion, complete required fields, and omit
optional fields that do not apply. Present the complete issue title and body in the conversation for review before
publication. The template provides the structure; the following guidance governs its content.

### Feature and goal

Give the feature a short title and describe the problem and observable definition of success.

### User story

"As a [specific user], I want [capability], so that [benefit]."

Keep the story focused on one coherent outcome. If the idea contains several independently useful features, propose a
split and identify which story this interview covers.

### Scope and constraints

List included behavior, explicit exclusions, and agreed constraints. Preserve the user's terminology and distinguish
mandatory requirements from preferences.

### Acceptance criteria

Number criteria as AC1, AC2, and so on, with a descriptive scenario title. Write each scenario in this form:

```text
AC1: [scenario title]
Given [specific initial context or state]
When [a single action or event occurs]
Then [an observable, testable result]
And [another necessary observable result, if any]
```

Cover the main success path and the relevant boundaries and failure paths established in the interview. Use concrete
examples or agreed thresholds where needed. Keep each scenario independently understandable and avoid implementation
details unless they are explicit requirements. Ensure every included behavior has a criterion and every criterion is
supported by an agreed requirement. Do not add speculative edge cases to inflate coverage.

### Technical notes

Record relevant existing components, data/API contracts, integration boundaries, dependencies, and validation needs.
Separate verified facts and hard constraints from suggested implementation approaches. Read `ARCHITECTURE.md` before
proposing architectural changes. Do not treat a suggested library or design as an agreed requirement.

Explain how acceptance criteria could be verified, including suitable test levels and deterministic fixtures when
useful. Do not write tests or implementation as part of this interview.

### Assumptions and open questions

List any remaining uncertainty, its impact, and whether it blocks implementation. If nothing remains, state that.
Do not label a draft ready while a question could materially change scope or expected behavior.

## Establish the shared definition of success

Present the concrete artifact and ask the user whether it captures the intended outcome or needs corrections. Apply
corrections and update affected criteria and notes together. Until the user confirms, label the artifact as a draft.
After confirmation, update the issue to the agreed version and continue with issue creation. Reuse an existing explicit
confirmation of the same content; do not request it again. If asked to stop early or if blocking questions remain,
provide the draft and its blockers without claiming it is ready for implementation.

## Create and hand off the issue

After the requirements are confirmed and no blocking questions remain, create the issue in the established target
using the selected template and agreed title and body. Invoking this issue-creation workflow authorizes that creation;
respect any user restriction to a draft, file, or different destination. Do not add assignees, labels, milestones, or
project membership unless requested or prescribed by the applicable template and supported by the target.

Prefer an available issue-tracker connector. For GitHub, an installed and authenticated `gh` CLI is a fallback; pass the
explicit repository and use a UTF-8 body file with `--body-file` to preserve Markdown and newlines. Do not install tools
or change authentication as part of the interview. If a creation attempt has an ambiguous result, check whether the
issue exists before retrying to avoid duplicates.

Verify the created issue's title, body, and destination from the returned result or a read-back, then provide its URL
as the handoff for tests and implementation. If creation is unavailable or fails, provide the complete template-based
title and body in the conversation, state that no issue was confirmed as created, and explain the concrete limitation.
Do not report a posted issue without a verified result. Save a local file only when requested.

This skill ends with the issue and its requirements; proceed to tests or implementation only when the user has
authorized that next phase.
