import { useEffect, useState } from 'react';
import { fetchContent, verifyPassword, publishContent, withDefaults, uid } from '../lib/content.js';

const PW_KEY = 'sr_admin_pw';
const getPw = () => { try { return sessionStorage.getItem(PW_KEY) || ''; } catch { return ''; } };
const setPw = (v) => { try { sessionStorage.setItem(PW_KEY, v); } catch { /* ignore */ } };
const clearPw = () => { try { sessionStorage.removeItem(PW_KEY); } catch { /* ignore */ } };

const IMG_HINT = 'Paste an image link, or add the file to the public/images folder and use /images/your-file.jpg';

/* What each form shows. Add a field here and it shows up in the admin. */
const F = {
  brand: [
    { key: 'name', label: 'Business name' },
    { key: 'mark', label: 'Logo letters', hint: 'Shown as the big letters in the logo, e.g. SR' },
    { key: 'tagline', label: 'Tagline', hint: 'e.g. Odisha To All India' },
    { key: 'slogan', label: 'Slogan under the buttons' },
    { key: 'motto', label: 'Motto (top right of the banner)' },
  ],
  hero: [
    { key: 'title', label: 'Main heading' },
    { key: 'subtitle', label: 'Text under the heading', type: 'textarea' },
    { key: 'cta', label: 'Main button text' },
    { key: 'caption', label: 'Small line near the temple picture' },
  ],
  sections: [
    { key: 'vehicles', label: 'Show the cars on the road', type: 'checkbox' },
    { key: 'packages', label: 'Show destinations', type: 'checkbox' },
    { key: 'features', label: 'Show "Why choose us"', type: 'checkbox' },
    { key: 'services', label: 'Show the services / book now bar', type: 'checkbox' },
    { key: 'reviews', label: 'Show reviews (only appears if you add some)', type: 'checkbox' },
    { key: 'showcase', label: 'Show the satisfied customers gallery (only appears if you add some)', type: 'checkbox' },
    { key: 'enquiry', label: 'Show the enquiry form and contact details', type: 'checkbox' },
  ],
  contact: [
    { key: 'phone', label: 'Phone number', hint: 'Used for every Call button' },
    { key: 'whatsapp', label: 'WhatsApp number', hint: 'Leave empty to use the phone number' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'hours', label: 'Support hours' },
    { key: 'instagram', label: 'Instagram link' },
    { key: 'facebook', label: 'Facebook link' },
    { key: 'youtube', label: 'YouTube link' },
  ],
  announcement: [
    { key: 'enabled', label: 'Show a bar at the very top of the site', type: 'checkbox' },
    { key: 'text', label: 'Text in the bar', hint: 'e.g. Festival season: book early for the best cars' },
  ],
  offer: [
    { key: 'enabled', label: 'Show the discount banner', type: 'checkbox' },
    { key: 'title', label: 'Heading' },
    { key: 'text', label: 'Text', type: 'textarea' },
    { key: 'cta', label: 'Button text' },
  ],
  title: [
    { key: 'title', label: 'Heading', hint: 'Type {brand} to insert your business name' },
    { key: 'sub', label: 'Text under the heading' },
  ],
  vehicle: [
    { key: 'name', label: 'Vehicle name' },
    { key: 'tagline', label: 'Short line under the name' },
    { key: 'seats', label: 'Seats', hint: 'e.g. 7 Seater' },
    { key: 'price', label: 'Price text', hint: 'e.g. Starting from ₹X per km. Empty shows "Call for price"' },
    { key: 'color', label: 'Car colour (for the drawing)', type: 'color' },
    { key: 'image', label: 'Photo (optional, replaces the drawing)', hint: IMG_HINT },
    { key: 'ac', label: 'Air-conditioned', type: 'checkbox' },
    { key: 'visible', label: 'Show on the website', type: 'checkbox' },
  ],
  package: [
    { key: 'name', label: 'Place / package name' },
    { key: 'subtitle', label: 'Short label', hint: 'e.g. Jagannath Temple' },
    { key: 'region', label: 'Which tab', type: 'select', options: [{ value: 'odisha', label: 'Odisha tour packages' }, { value: 'india', label: 'Out of Odisha tour packages' }] },
    { key: 'tags', label: 'Filters', hint: 'Comma separated, e.g. Temples, Beaches. These become the filter buttons.' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'duration', label: 'Duration (optional)', hint: 'e.g. 3 days / 2 nights' },
    { key: 'price', label: 'Price text (optional)', hint: 'Empty shows "Ask for a quote"' },
    { key: 'emoji', label: 'Emoji (used when there is no photo)' },
    { key: 'image', label: 'Photo (optional)', hint: IMG_HINT },
    { key: 'visible', label: 'Show on the website', type: 'checkbox' },
  ],
  feature: [
    { key: 'title', label: 'Title' },
    { key: 'desc', label: 'Short description', type: 'textarea' },
    { key: 'icon', label: 'Emoji or symbol' },
  ],
  service: [
    { key: 'title', label: 'Service name' },
    { key: 'desc', label: 'Short description', type: 'textarea' },
    { key: 'icon', label: 'Emoji or symbol' },
  ],
  review: [
    { key: 'name', label: 'Customer name' },
    { key: 'place', label: 'City or trip (optional)', hint: 'e.g. Puri family trip' },
    { key: 'text', label: 'What they said', type: 'textarea' },
    { key: 'rating', label: 'Rating', type: 'select', options: [{ value: '', label: 'No rating shown' }, { value: '5', label: '★★★★★ 5 out of 5' }, { value: '4', label: '★★★★ 4 out of 5' }, { value: '3', label: '★★★ 3 out of 5' }, { value: '2', label: '★★ 2 out of 5' }, { value: '1', label: '★ 1 out of 5' }] },
    { key: 'photo', label: 'Customer photo (optional)', hint: IMG_HINT + '. Without one, their initial is shown instead.' },
    { key: 'visible', label: 'Show on the website', type: 'checkbox' },
  ],
  showcase: [
    { key: 'caption', label: 'Caption', hint: 'e.g. Puri family trip with our founder', type: 'textarea' },
    { key: 'customerPhoto', label: 'Customer photo', hint: IMG_HINT },
    { key: 'ownerPhoto', label: 'Owner photo', hint: IMG_HINT + '. Shown as a small circle over the customer photo.' },
    { key: 'visible', label: 'Show on the website', type: 'checkbox' },
  ],
};

const BLANK = {
  vehicle: { name: '', tagline: '', seats: '', ac: true, price: '', color: '#ffffff', image: '', visible: true },
  package: { name: '', subtitle: '', region: 'odisha', tags: '', description: '', duration: '', price: '', emoji: '📍', image: '', visible: true },
  feature: { icon: '⭐', title: '', desc: '' },
  service: { icon: '🧳', title: '', desc: '' },
  review: { name: '', place: '', text: '', rating: '5', photo: '', visible: true },
  showcase: { caption: '', customerPhoto: '', ownerPhoto: '', visible: true },
};

const TABS = [
  ['general', '🏷️ Brand & banner'],
  ['contact', '📞 Contact'],
  ['vehicles', '🚗 Vehicles'],
  ['packages', '🗺️ Packages'],
  ['features', '⭐ Why choose us'],
  ['services', '🧳 Services'],
  ['offer', '🎁 Offers & top bar'],
  ['reviews', '💬 Reviews'],
  ['showcase', '📸 Customer showcase'],
  ['titles', '✏️ Section headings'],
  ['backup', '💾 Backup'],
];

const TITLE_LABELS = {
  packages: 'Destinations section',
  features: 'Why choose us section',
  services: 'Services / book now bar',
  reviews: 'Reviews section',
  showcase: 'Customer showcase section',
  enquiry: 'Enquiry form section',
};

/* ------------------------------------------------------------ form building blocks */
function FieldInput({ f, value, onChange }) {
  const v = value ?? '';
  if (f.type === 'textarea') return <textarea rows={3} value={v} onChange={(e) => onChange(e.target.value)} />;
  if (f.type === 'select') {
    return (
      <select value={v} onChange={(e) => onChange(e.target.value)}>
        {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  }
  if (f.type === 'checkbox') return <input type="checkbox" checked={value !== false && !!value} onChange={(e) => onChange(e.target.checked)} />;
  if (f.type === 'color') return <input type="color" value={v || '#ffffff'} onChange={(e) => onChange(e.target.value)} />;
  return <input value={v} onChange={(e) => onChange(e.target.value)} />;
}

function Fields({ fields, data, onChange }) {
  return (
    <div className="fields">
      {fields.map((f) => (
        <label key={f.key} className={'fld' + (f.type === 'textarea' ? ' full' : '') + (f.type === 'checkbox' ? ' chk' : '')}>
          <span>{f.label}</span>
          <FieldInput f={f} value={data[f.key]} onChange={(v) => onChange(f.key, v)} />
          {f.hint && <small>{f.hint}</small>}
        </label>
      ))}
    </div>
  );
}

function Panel({ title, hint, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {hint && <p className="hint">{hint}</p>}
      {children}
    </section>
  );
}

function ListEditor({ items, onChange, fields, blank, nameKey = 'name', noun }) {
  const [open, setOpen] = useState({});
  const set = (i, key, val) => onChange(items.map((it, n) => (n === i ? { ...it, [key]: val } : it)));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i) => { if (window.confirm(`Delete this ${noun}?`)) onChange(items.filter((_, n) => n !== i)); };
  const add = () => {
    const item = { ...blank, id: uid() };
    setOpen((o) => ({ ...o, [item.id]: true }));
    onChange([...items, item]);
  };

  return (
    <div>
      {items.length === 0 && <p className="hint">Nothing here yet.</p>}
      {items.map((it, i) => (
        <div className={'item' + (it.visible === false ? ' off' : '')} key={it.id}>
          <div className="item-head" onClick={() => setOpen((o) => ({ ...o, [it.id]: !o[it.id] }))}>
            <span className="chev">{open[it.id] ? '▾' : '▸'}</span>
            <span className="item-title">{it[nameKey] || `New ${noun}`}</span>
            {it.visible === false && <em>hidden</em>}
            <span className="item-actions" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} title="Move up" aria-label="Move up">↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} title="Move down" aria-label="Move down">↓</button>
              <button type="button" onClick={() => remove(i)} title="Delete" aria-label={`Delete ${noun}`}>🗑</button>
            </span>
          </div>
          {open[it.id] && <Fields fields={fields} data={it} onChange={(k, v) => set(i, k, v)} />}
        </div>
      ))}
      <button type="button" className="btn btn-navy btn-sm" onClick={add}>+ Add {noun}</button>
    </div>
  );
}

/* ------------------------------------------------------------------------ screens */
function Login({ onAuth }) {
  const [pw, setPwValue] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const r = await verifyPassword(pw);
    setBusy(false);
    if (r.ok) { setPw(pw); onAuth({ password: pw, offline: !!r.offline }); }
    else setErr(r.error || 'Could not sign in.');
  };

  return (
    <div className="login">
      <form onSubmit={submit}>
        <h1>Admin sign in</h1>
        <p className="hint">Enter the admin password to edit the website.</p>
        <label className="fld">
          <span>Password</span>
          <input type="password" value={pw} onChange={(e) => setPwValue(e.target.value)} autoFocus autoComplete="current-password" />
        </label>
        {err && <p className="err" role="alert">{err}</p>}
        <button className="btn btn-sun" disabled={busy}>{busy ? 'Checking…' : 'Sign in'}</button>
        <a className="back" href="/">← Back to website</a>
      </form>
    </div>
  );
}

function Editor({ auth, onLogout }) {
  const [saved, setSaved] = useState(null);
  const [draft, setDraft] = useState(null);
  const [info, setInfo] = useState({ configured: true });
  const [tab, setTab] = useState('general');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchContent({ fresh: true }).then((r) => { setSaved(r.content); setDraft(r.content); setInfo(r); });
  }, []);

  const dirty = !!draft && JSON.stringify(draft) !== JSON.stringify(saved);
  useEffect(() => {
    const warn = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  if (!draft) return <div className="splash">Loading…</div>;

  const setIn = (section) => (key, value) => setDraft((d) => ({ ...d, [section]: { ...d[section], [key]: value } }));
  const setList = (section) => (items) => setDraft((d) => ({ ...d, [section]: items }));
  const setTitle = (sec) => (key, value) => setDraft((d) => ({ ...d, titles: { ...d.titles, [sec]: { ...d.titles[sec], [key]: value } } }));

  const save = async () => {
    setBusy(true);
    setStatus({ type: '', msg: '' });
    const r = await publishContent(draft, auth.password, auth.offline);
    setBusy(false);
    if (r.ok) {
      setSaved(draft);
      setStatus({ type: 'ok', msg: auth.offline ? 'Saved in this browser only (no server found).' : 'Published. Visitors will see it within a minute.' });
    } else {
      setStatus({ type: 'err', msg: r.error || 'Could not save.' });
    }
  };

  const exportJson = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sr-tour-travel-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  const importJson = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    file.text().then((text) => {
      try { setDraft(withDefaults(JSON.parse(text))); setStatus({ type: '', msg: '' }); }
      catch { setStatus({ type: 'err', msg: 'That file is not a valid backup.' }); }
    });
  };
  const resetAll = () => {
    if (window.confirm('Replace everything in the editor with the original content? Nothing goes live until you press Save & publish.')) setDraft(withDefaults(null));
  };

  const message = status.type === 'err' ? status.msg : dirty ? '● Unsaved changes' : status.msg || '✓ Everything is saved';

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="container adm-top-in">
          <h1>Website admin</h1>
          <div className="adm-top-actions">
            <a className="btn btn-line-w btn-sm" href="/" target="_blank" rel="noreferrer">View website</a>
            <button className="btn btn-line-w btn-sm" onClick={onLogout}>Sign out</button>
          </div>
        </div>
      </header>

      <div className="container adm-body">
        <nav className="adm-nav" aria-label="Sections">
          {TABS.map(([id, label]) => (
            <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>
          ))}
        </nav>

        <main>
          {auth.offline && (
            <p className="notice">Preview mode: no server was found (normal when running <code>npm run dev</code>). Changes are saved in this browser only. On Vercel, they are published for everyone.</p>
          )}
          {!auth.offline && info.configured === false && (
            <p className="notice">The database is not connected yet, so publishing will fail. In Vercel, open Storage, add Upstash Redis, connect it to this project and redeploy (see the README).</p>
          )}

          {tab === 'general' && (
            <>
              <Panel title="Brand" hint="Your name, logo letters and the lines around the top of the page."><Fields fields={F.brand} data={draft.brand} onChange={setIn('brand')} /></Panel>
              <Panel title="Main banner"><Fields fields={F.hero} data={draft.hero} onChange={setIn('hero')} /></Panel>
              <Panel title="Show or hide sections"><Fields fields={F.sections} data={draft.sections} onChange={setIn('sections')} /></Panel>
            </>
          )}

          {tab === 'contact' && (
            <Panel title="Contact details" hint="Used for the Call and WhatsApp buttons, the enquiry form and the footer. Empty fields are hidden.">
              <Fields fields={F.contact} data={draft.contact} onChange={setIn('contact')} />
            </Panel>
          )}

          {tab === 'vehicles' && (
            <Panel title="Vehicles" hint="These are the cars on the road at the top of the page. Use the arrows to change the order.">
              <ListEditor items={draft.vehicles} onChange={setList('vehicles')} fields={F.vehicle} blank={BLANK.vehicle} noun="vehicle" />
            </Panel>
          )}

          {tab === 'packages' && (
            <Panel title="Tour packages" hint="Each package appears on the Odisha or Out of Odisha tab. Filters are built from the tags you type.">
              <ListEditor items={draft.packages} onChange={setList('packages')} fields={F.package} blank={BLANK.package} noun="package" />
            </Panel>
          )}

          {tab === 'features' && (
            <Panel title="Why choose us" hint="The reasons customers should book with you.">
              <ListEditor items={draft.features} onChange={setList('features')} fields={F.feature} blank={BLANK.feature} nameKey="title" noun="reason" />
            </Panel>
          )}

          {tab === 'services' && (
            <Panel title="Services" hint="Shown in the dark blue Book now bar. Each one opens WhatsApp when tapped.">
              <ListEditor items={draft.services} onChange={setList('services')} fields={F.service} blank={BLANK.service} nameKey="title" noun="service" />
            </Panel>
          )}

          {tab === 'offer' && (
            <>
              <Panel title="Discount banner"><Fields fields={F.offer} data={draft.offer} onChange={setIn('offer')} /></Panel>
              <Panel title="Top bar" hint="A slim message above the menu, handy for festival offers or notices."><Fields fields={F.announcement} data={draft.announcement} onChange={setIn('announcement')} /></Panel>
            </>
          )}

          {tab === 'reviews' && (
            <Panel title="Customer reviews" hint="Only add real reviews. The section stays hidden until you add one.">
              <ListEditor items={draft.testimonials} onChange={setList('testimonials')} fields={F.review} blank={BLANK.review} noun="review" />
            </Panel>
          )}

          {tab === 'showcase' && (
            <Panel title="Satisfied customers gallery" hint="Add a customer photo and a photo of the owner with them. Images are links only, same as everywhere else. The section stays hidden until you add one.">
              <ListEditor items={draft.showcase} onChange={setList('showcase')} fields={F.showcase} blank={BLANK.showcase} nameKey="caption" noun="photo" />
            </Panel>
          )}

          {tab === 'titles' && Object.keys(draft.titles).map((k) => (
            <Panel key={k} title={TITLE_LABELS[k] || k}><Fields fields={F.title} data={draft.titles[k]} onChange={setTitle(k)} /></Panel>
          ))}

          {tab === 'backup' && (
            <Panel title="Backup and restore" hint="Download a copy of everything on the site, or load a saved copy back in.">
              <div className="row">
                <button className="btn btn-navy btn-sm" onClick={exportJson}>Download backup</button>
                <label className="btn btn-line btn-sm">Load a backup<input type="file" accept="application/json" hidden onChange={importJson} /></label>
                <button className="btn btn-line btn-sm" onClick={resetAll}>Reset to original</button>
              </div>
              <p className="hint">Loading a backup or resetting only changes the editor. Press Save &amp; publish to make it live.</p>
            </Panel>
          )}
        </main>
      </div>

      <div className="savebar">
        <div className="container savebar-in">
          <span className={'status ' + status.type}>{message}</span>
          <button className="btn btn-sun" disabled={!dirty || busy} onClick={save}>{busy ? 'Saving…' : 'Save & publish'}</button>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [auth, setAuth] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.title = 'Admin – SR Tour & Travel';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex,nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => {
    const pw = getPw();
    if (!pw) { setReady(true); return; }
    verifyPassword(pw).then((r) => {
      if (r.ok) setAuth({ password: pw, offline: !!r.offline });
      else clearPw();
      setReady(true);
    });
  }, []);

  if (!ready) return <div className="splash">Loading…</div>;
  if (!auth) return <Login onAuth={setAuth} />;
  return <Editor auth={auth} onLogout={() => { clearPw(); setAuth(null); }} />;
}