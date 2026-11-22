<div align="center">

# Adhyayan courses

**Free, open courses for the [Adhyayan](https://github.com/Samir-Giripunje/adhyayan) study app.**

[![Publish](https://github.com/Samir-Giripunje/adhyayan-courses/actions/workflows/publish.yml/badge.svg)](https://github.com/Samir-Giripunje/adhyayan-courses/actions/workflows/publish.yml)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/license-CC%20BY--SA%204.0-16a34a)](LICENSE)
[![Get the app](https://img.shields.io/github/v/release/Samir-Giripunje/adhyayan?label=get%20the%20app&color=f5a524)](https://github.com/Samir-Giripunje/adhyayan/releases/latest)

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Samir-Giripunje/adhyayan/main/docs/media/lesson-dark.png">
  <img src="https://raw.githubusercontent.com/Samir-Giripunje/adhyayan/main/docs/media/lesson-light.png" width="820" alt="A lesson in Adhyayan: a step-by-step diagram of HTTP requests and responses">
</picture>

</div>

<br>

This repository holds every lesson, practice question and hands-on task in Adhyayan. **You don't need it to use the
app.** The app downloads courses from here by itself: open **Explore courses** and press **Get**.

It's here so anyone can read the courses, fix a mistake, or help write new lessons.

## The courses

| Course | What you'll learn |
|---|---|
| **System Design for Interviews** | How real systems are built, from a single web request to millions of users: caching, databases, queues and reliability, then case studies and timed mock interviews. |
| **AWS Certified Cloud Practitioner (CLF-C02)** | Get ready for the exam: cloud basics, the core AWS services, security, pricing and support, with practice for each exam domain and timed mock exams. |
| **Python Decorators** | What `@` really does, how to write your own, decorators with arguments, class decorators, and how `@property` works underneath. |
| **Embeddings and semantic search** | How text becomes numbers that capture meaning, and how to build, tune and test semantic search with them. |

Every course has its full plan, but many lessons aren't written yet. The app shows them as "not written yet", and
anyone with the app and their own Claude or ChatGPT login can write one with **Generate**. New lessons reach everyone
as an **Update** in the app, and their progress is kept.

## Fix a mistake in a lesson

Spotted something wrong? Thank you. The easiest way is to
[open an issue](https://github.com/Samir-Giripunje/adhyayan-courses/issues/new) saying which lesson and what's wrong.

To fix it yourself:

1. **Find the lesson.** Open it in the app. The lesson id is the last part of the address
   (`#/c/<course>/t/<lesson id>`). The lesson lives in `atlas/topics/<lesson id>/topic.json`, and its practice
   questions in `items.json` next to it.
2. **Edit the text.** Keep each block's `id` as it is, because learners' notes are attached to it.
3. **Check it.** With the [app](https://github.com/Samir-Giripunje/adhyayan) cloned next to this folder, run
   `npm run check`. It runs the same checks as GitHub.
4. **Open a pull request** saying what was wrong and how you checked. Once it's merged, everyone gets the fix as an
   update.

## Write new lessons

1. Clone this repository and the [app](https://github.com/Samir-Giripunje/adhyayan) side by side.
2. In the app folder, run `npm install`, then `npm start`. In development the app uses this folder for its courses.
3. Open a course, pick a lesson that's "not written yet", and press **Generate**. It's written through your own
   Claude or ChatGPT login and saved into this folder.
4. Read it, fix anything that's off, run `npm run check`, and open a pull request.

Only add material you have the right to share. Never commit `courses/*/changes/` (they can point at files you
uploaded) or third-party exam papers. Papers you own stay on your computer; see *Papers you own* below.

## How publishing works

Every push to `main` runs a GitHub Action that checks every course, packs each one into a course file, and publishes a
catalogue the app reads:

**https://samir-giripunje.github.io/adhyayan-courses/catalog.json**

If any check fails, nothing is published. The app notices a new version of a course and offers **Update**, with a
short "what's new" line such as *2 new lessons, 1 improved*. Version numbers go up by themselves, so you never bump
them by hand.

<details>
<summary><b>What's in this repository</b></summary>

<br>

| Path | What |
|---|---|
| `courses/<id>/` | One folder per course: `course.json` (the course: stages, units, which lessons it places), its plan (`course-pass.json`, `architect/`), units, sections (practice sets, hands-on tasks), the sources it was planned from (`sources.json`) and build records the app reads. |
| `courses/index.json` | The courses in this folder, with the extras each has (sections, practice, forecasts). The app reads it when it runs on this folder. |
| `courses/index.local.json` | Not in the repository (ignored): sections kept on your computer only, such as papers you own. The app adds them when it runs on this folder; the build never reads it. |
| `courses/catalogue.json` | Phrases the app's goal box matches to a course here ("system design" → System Design for Interviews). |
| `atlas/topics/<id>/` | One folder per lesson: `topic.json` (the lesson), `items.json` (practice), `sealed/` (test forms), `placement.json` where a course has a placement check. Lesson ids are shared across courses. |
| `sheets/` | Problem lists (Blind 75 and NeetCode 150 subsets): links to each problem, with our own short gist and hints. No problem statements. |
| `published.json` | Which courses and problem lists go into the public catalogue, and their tags. |
| `app-ref.txt` | The commit of [the app](https://github.com/Samir-Giripunje/adhyayan) whose tools validate and pack these courses. Bump it to build with a newer app. |
| `scripts/build.mjs` | `npm run build`: the same build as CI, locally, using an app checkout next to this one. |
| `.github/workflows/` | `publish.yml` (push to `main`: validate, build, deploy to GitHub Pages) and `check.yml` (pull requests: validate and build, publish nothing). |

</details>

<details>
<summary><b>The build, step by step</b></summary>

<br>

`publish.yml` checks out this repository and the app at the commit in `app-ref.txt`, installs only what the app's
command-line tools need (no Electron, no browsers), and runs `node app/tools/publish.mjs`:

1. Every course in `published.json` is validated with the app's own checks (schemas, lints, and the minimums every
   written lesson must meet). A failure stops the build.
2. Each course is packed into a course file (`.adhy`). The same content always gives the same bytes.
3. `catalog.json` lists each course with its title, summary, tags, lessons written and planned, estimated hours, file
   size, revision, checksum, the oldest app version that reads it, and the what's-new line, computed against the
   catalogue that is live now.
4. The site (`catalog.json`, `courses/*.adhy`, `lists/*.json`, a small `index.html`) is deployed to GitHub Pages.

**Revisions.** A course's revision starts at its `course.json` version, stays the same while its content is unchanged,
and goes up by at least one whenever the content changes. It never goes down: the build counts from the live
catalogue and refuses to run if that can't be read (other than "not published yet"). A course taken out of
`published.json` keeps its last revision in the catalogue's `retired` list, so it continues from there if it comes
back.

**Preview a build locally:**

```bash
git clone https://github.com/Samir-Giripunje/adhyayan.git          # next to this repository
(cd adhyayan && npm install)
cd adhyayan-courses
npm run build      # validates and writes site/ (catalog.json, course files, problem lists)
npm run check      # validate only, as pull requests do
```

To try the result in the app, serve `site/` (for example `npx http-server site -p 8099`) and start the app with
`ADHY_CATALOG=http://127.0.0.1:8099/catalog.json ADHY_ALLOW_LOCAL_HTTP=1 npm start`.

</details>

<details>
<summary><b>Papers you own</b></summary>

<br>

The CLF-C02 course doesn't include third-party exam questions. If you own sample papers or past papers, attach them to
your copy of the course with **Change this course** in the app. They stay on your computer and are never put into a
course file or the catalogue. AWS publishes its own sample questions on the
[AWS Certified Cloud Practitioner](https://aws.amazon.com/certification/certified-cloud-practitioner/) page.

If you attach papers while running the app on this checkout, list their section in `courses/index.local.json`
(ignored, same `sections` map as `courses/index.json`) instead of `courses/index.json`, and add the section file to
`.gitignore`. The app shows them; the build never publishes them. It also leaves out any question set from a
third-party publisher unless the set's source says `redistribute: true` (the publisher's licence or permission allows
sharing the questions).

</details>

## License

The course content in this repository is licensed under the
[Creative Commons Attribution-ShareAlike 4.0 International licence](LICENSE) (CC BY-SA 4.0), © 2026 Samir Giripunje
and contributors, **except for the third-party material listed below**, which keeps its owners' terms and is not
relicensed. The app itself is a separate repository under the MIT licence.

### Third-party material (not covered by CC BY-SA)

- **Problem lists** (`sheets/`): problem titles, numbers and links to [LeetCode](https://leetcode.com); list membership
  from the [Blind 75](https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU)
  and [NeetCode 150](https://neetcode.io) lists. The gists and hints are our own words; no problem statements are
  stored.
- **Outline sources** (`courses/*/sources.json`): the tables of contents the courses were planned from, stored as
  section titles with a link and a checksum of what was read: [roadmap.sh](https://roadmap.sh) (AI engineer, system
  design and AWS roadmaps), [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer),
  [karanpratapsingh/system-design](https://github.com/karanpratapsingh/system-design),
  [ashishps1/awesome-system-design-resources](https://github.com/ashishps1/awesome-system-design-resources),
  [kananinirav/AWS-Certified-Cloud-Practitioner-Notes](https://github.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes),
  the AWS CLF-C02 exam guide (docs.aws.amazon.com), Python PEP 318 and PEP 3129, the CPython documentation (`functools`,
  the descriptor how-to), the [sentence-transformers](https://www.sbert.net/) documentation and the
  [FAISS wiki](https://github.com/facebookresearch/faiss/wiki). Those documents keep their own licences; the lessons
  were written for this project from that outline, not copied from them.
