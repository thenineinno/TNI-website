# How to edit the website yourself

Every change is made on **github.com** → repository **thenineinno/TNI-website**.
When you click **Commit changes**, Cloudflare rebuilds the site automatically and the change is
live in about 1–2 minutes. No software to install.

---

## 1. Change text

| What you want to change | File |
|---|---|
| Thai text (the main site) | `content/th.json` |
| English text | `content/en.json` |
| Phone, email, address, Facebook link, map, tax ID | `site.config.json` |

**Steps**
1. Open the file on GitHub → click the **pencil icon ✏️** (top right of the file).
2. Press **Ctrl+F / ⌘+F** and search for the text you see on the website.
3. Change only the words **between the quotes** `"…"`.
4. Click **Commit changes…** → **Commit changes**.

Always change **both** `th.json` and `en.json` so the two languages match.

**Where each section lives inside `th.json` / `en.json`**

| Section on the website | Key in the file |
|---|---|
| Google search title / description | `meta` |
| Big headline, buttons, numbers (10+, 38, 7) | `hero` |
| About us, vision, mission | `about` |
| The 4 service cards | `services` → `items` |
| Project history table | `projects` → `items` |
| Facebook section | `updates` |
| Contact section labels | `contact` |

### ⚠️ Rules so you don't break the file
- Keep the quotes: `"title": "ลิฟต์"` ✅  `"title": ลิฟต์` ❌
- Need a quote **inside** text? Write `\"`.
- Keep the **commas** between items exactly as they are. The last item in a list has **no** comma.
- In the headline, `<br>` = new line and `<span class=\"hl\">…</span>` = the green highlighted word. Keep them.
- If the site doesn't update after a commit: Cloudflare → **Workers & Pages → tni-website → Deployments** →
  open the failed build to see the line with the error. Or go to the file's **History** on GitHub and
  undo your last change.

### Add a project to the table
In `projects` → `items`, copy one block, paste it after the last one, add a comma between them, and edit:
```json
{ "name": "โรงแรมตัวอย่าง", "place": "สงขลา", "qty": 2, "work": "inst" }
```
`work`: `"inst"` = ติดตั้ง (installation), `"mod"` = ปรับปรุง (modernization). `qty` is a number with no quotes.
(In `en.json`, write the English name and province, e.g. `"place": "Songkhla"`.)

---

## 2. Add or change pictures

### Step A: upload the picture
1. On GitHub, open the folder `static/assets/`.
2. **Add file → Upload files** → drag your photo in → **Commit changes**.

Tips: use **.jpg** for photos, under **500 KB** (compress free at squoosh.app). Name files in
English with no spaces, e.g. `hero-lift.jpg`, `service-escalator.jpg`.

### Step B: tell the site where to use it

| Where | File | What to write |
|---|---|---|
| Big photo next to the headline (replaces the green logo) | `site.config.json` | `"heroImage": "/assets/hero-lift.jpg"` |
| Photo on top of a service card (replaces its icon) | `content/th.json` **and** `content/en.json` → `services` → `items` | `"image": "/assets/service-escalator.jpg"` |

- Best shapes: headline photo **portrait 4:5** (e.g. 900×1100). Service photos **landscape 3:2** (e.g. 900×600).
- To go back to the logo/icon, set the value back to empty: `""`.
- The headline photo's description for Google and screen readers is `hero` → `imageAlt`.

### Replace an existing image
Upload a new file with **exactly the same name** (e.g. `og-image.png`). GitHub replaces the old one.

| File in `static/assets/` | Used for |
|---|---|
| `og-image.png` (1200×630) | Preview picture when the link is shared on Facebook/LINE |
| `logo.svg`, `mark.svg` | Logo in the footer / green "N" mark |
| `icon-512.png`, `apple-touch-icon.png`, `../favicon.ico` | Browser tab & phone home-screen icons |

---

## 3. Change service icons
Each card in `services` → `items` has `"icon"`. You can swap between the 4 built-in icons:
`"lift"`, `"escalator"`, `"gear"`, `"hand"`.
For a completely different look, add a photo with `"image"` instead (section 2).

---

## 4. Facebook posts
Nothing to edit. Post on the Facebook page and the newest 6 public posts appear on the website
within about 15 minutes.

---

## Bigger changes
Layout, colours, new sections or new pages: start a Claude Code session with this repository and
describe what you want.
