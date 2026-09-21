# SR Tour & Travel website

React + Vite landing page with a password-protected admin page at `/admin`.
The admin can change everything on the landing page: brand, banner text, contact details,
vehicles, tour packages, "why choose us", services, offers, reviews, section headings, and can
show or hide whole sections. Changes go live for all visitors when you press **Save & publish**.

- `/` is the public website
- `/admin` is the editor (not linked anywhere, hidden from search engines)

## Run it on your computer

```bash
npm install
npm run dev
```

Open http://localhost:5173. In this mode there is no server, so `/admin` runs in **preview mode**:
any password works and edits are stored in your browser only. This is for trying things out.
To test the real backend locally, install the Vercel CLI and run `vercel dev` instead.

## Put it online with Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New > Project**, import the repository and deploy. The Vite preset is detected automatically.
3. Set the admin password: **Project > Settings > Environment Variables**, add `ADMIN_PASSWORD` with a strong password.
4. Add the database, which is where published changes are stored: **Project > Storage > Create / Connect Database > Upstash Redis** (the free plan is plenty). Connect it to this project. Vercel adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` for you.
5. **Redeploy** (Deployments > the latest one > Redeploy) so the new variables are picked up.
6. Open `https://your-site.vercel.app/admin`, sign in, edit, press **Save & publish**.

Until step 4 is done the site still works and shows the default content from `src/content/defaultContent.js`.
Publishing needs the database, and the admin tells you if it is missing.

Visitors see a change within about a minute (a short CDN cache keeps the site fast).

## Using the admin

- **Vehicles / Packages / Why choose us / Services / Reviews**: click an item to open it, use the arrows to reorder, the bin to delete, and **+ Add** for new ones. "Show on the website" hides an item without deleting it.
- **Packages**: pick the tab it belongs to (Odisha or Out of Odisha). The filter buttons on the site are built from the comma separated tags you type (for example `Temples, Beaches`).
- **Photos**: paste an image link, or add the file to `public/images/` in this project and use `/images/your-file.jpg`. Without a photo, packages show an emoji on a colour panel and vehicles show the drawn car (you can pick its colour).
- **Reviews**: the section stays hidden until you add a real review.
- **Backup**: download all content as a JSON file and load it back later. "Reset to original" only changes the editor until you publish.

## How enquiries work

The enquiry form has no server behind it. It opens WhatsApp with the customer's details already typed
into a message to your number, so nothing is lost and no form service is needed. The phone number
and WhatsApp number both come from the admin (Contact tab).

## Good to know

- One shared admin password (`ADMIN_PASSWORD`). Change it any time in Vercel and redeploy.
- Everything is saved as one JSON document (limit about 900 KB), so use image links rather than embedded images.
- To change the starting content or design in code: `src/content/defaultContent.js` (text and data), `src/styles.css` (look), `src/pages/Landing.jsx` (page), `src/pages/Admin.jsx` (editor), `api/content.js` (backend).
- Fonts (Bricolage Grotesque and Kalam) load from Google Fonts. The site falls back to system fonts if they are blocked.
