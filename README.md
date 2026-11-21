# Adhyayan courses

The course content for [Adhyayan](https://github.com/Samir-Giripunje/adhyayan), a study app that runs on your computer.
This repository holds the courses as plain JSON. On every push to `main`, a GitHub Action builds a course file for
each published course and a `catalog.json`, and publishes them at:

**https://samir-giripunje.github.io/adhyayan-courses/catalog.json**

The app reads that catalogue: **Explore courses** lists what is here, **Get** downloads a course, and **Update**
brings in a newer revision while keeping your progress. You never need this repository to use the app.

## What is in it

| Path | What |
|---|---|
| `courses/<id>/` | One folder per course: `course.json` (the course: stages, units, which lessons it places), its plan (`course-pass.json`, `architect/`), units, sections (practice sets, hands-on tasks), the sources it was planned from (`sources.json`) and build records the app reads. |
| `courses/index.json` | The courses in this folder, with the extras each has (sections, practice, forecasts). The app reads it when it runs on this folder. |
| `courses/index.local.json` | Not in the repository (ignored): sections kept on your computer only, such as papers you own. The app adds them to `courses/index.json`'s when it runs on this folder; the build never reads it. |
| `courses/catalogue.json` | Phrases the app's goal box matches to a course here ("system design" → System Design for Interviews). |
| `atlas/topics/<id>/` | One folder per lesson: `topic.json` (the lesson), `items.json` (practice), `sealed/` (test forms), `placement.json` where a course has a placement check. Lesson ids are shared across courses. |
| `sheets/` | Problem lists (Blind 75 and NeetCode 150 subsets): links to each problem, with our own short gist and hints. No problem statements. |
| `published.json` | Which courses and problem lists go into the public catalogue, and their tags. |
| `app-ref.txt` | The commit of [Samir-Giripunje/adhyayan](https://github.com/Samir-Giripunje/adhyayan) whose tools validate and pack these courses. Bump it to build with a newer app. |
| `scripts/build.mjs` | `npm run build`: the same build as CI, locally, using an app checkout next to this one. |
| `.github/workflows/` | `publish.yml` (push to `main`, or by hand: validate, build, deploy to GitHub Pages) and `check.yml` (pull requests: validate and build, publish nothing). |

The four courses: **System Design for Interviews**, **AWS Certified Cloud Practitioner (CLF-C02)**, **Python
Decorators: From @ Syntax to Descriptors**, and **Embeddings and semantic search**. Most lessons are still unwritten:
the app shows them as "not written yet", and anyone with the app and their own AI subscription can write one (see
below).

**Exam questions.** The CLF-C02 course doesn't include third-party exam questions. If you own sample papers or past
papers, attach them to your copy of the course with **Change this course** in the app; they stay on your computer and
are never put into a course file or the catalogue. AWS publishes its own sample questions on the
[AWS Certified Cloud Practitioner](https://aws.amazon.com/certification/certified-cloud-practitioner/) page.

## How publishing works

`publish.yml` checks out this repository and the app at the commit in `app-ref.txt`, installs only what the app's
command-line tools need (`npm ci --ignore-scripts --omit=dev --omit=optional`: no Electron, no browsers), and runs
`node app/tools/publish.mjs`:

1. every course in `published.json` is validated with the app's own checks (`adhy validate`: schemas, lints, the
   minimums every written lesson must meet); a failure stops the build and nothing is published;
2. each course is packed into a course file (`.adhy`). The same content always gives the same bytes;
3. `catalog.json` lists each course with its title, summary, tags, lessons written and planned, estimated hours, file
   size, revision, checksum, the oldest app version that reads it, and a short **what's new** line ("2 new lessons,
   1 improved"), computed against the catalogue that is live now;
4. the site (`catalog.json`, `courses/*.adhy`, `lists/*.json`, a small `index.html`) is deployed to GitHub Pages.

**Revisions.** Each course has a revision in the catalogue, and the app offers an update when the revision goes up.
The revision starts at the course's `course.json` version, stays the same while the course's content is unchanged,
and goes up by at least one whenever the content changes, even if `course.json` keeps its version. It never goes
down: the build counts from the live catalogue, and refuses to build if the live catalogue can't be read for any
reason other than "not published yet". A course taken out of `published.json` keeps its last revision in the
catalogue's `retired` list, so it continues from there if it comes back. You don't need to bump versions by hand.

## Preview a build locally

```bash
git clone https://github.com/Samir-Giripunje/adhyayan.git          # next to this repository
(cd adhyayan && npm install)
cd adhyayan-courses
npm run build      # validates and writes site/ (catalog.json, course files, problem lists)
npm run check      # validate only, as pull requests do
```

To try the result in the app, serve `site/` on your computer (for example `npx http-server site -p 8099`) and start
the app with `ADHY_CATALOG=http://127.0.0.1:8099/catalog.json ADHY_ALLOW_LOCAL_HTTP=1 npm start`.

## Contributing a lesson fix

1. Find the lesson: `atlas/topics/<lesson id>/topic.json`. The lesson id is in the app's address bar when the lesson
   is open (`#/c/<course>/t/<lesson id>`).
2. Fix the text in the block that is wrong (keep each block's `id`: learners' notes and explanations are anchored to
   it). For a practice question, edit `items.json` next to it.
3. Run `npm run check` (with the app checked out next to this repository). It runs the same checks as CI.
4. Open a pull request saying what was wrong and how you checked it. The check workflow validates it; once merged,
   the catalogue publishes a new revision, and learners see **Update available** with the change in what's new.

**Writing lessons with the app.** Run the app from source next to this repository (`npm start` in `adhyayan`): in
development it uses this checkout as its course folder, so lessons you generate with **Generate** (through your own
Claude or ChatGPT subscription) are written here, ready to review and commit. The app's own generation queue and
records go to `desk/`, which is ignored.

Don't add material you don't have the right to share, and don't commit `courses/*/changes/` (change requests can
point at files you uploaded; they are ignored). Papers you attach while running the app on this checkout are
yours to keep locally: list their section in `courses/index.local.json` (ignored, same `sections` map as
`courses/index.json`) instead of `courses/index.json`, and add the section file to `.gitignore`. The app shows them;
the build never publishes them, and it leaves out any question set from a third-party publisher unless the set's
source says `redistribute: true` (the publisher's licence or permission allows sharing the questions).

## Licence

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
