import { useEffect, useState } from 'react';
import { fetchContent, getCached, withDefaults, waLink, telLink, digits, splitTags, safeUrl } from '../lib/content.js';
import { Icon } from '../components/Icons.jsx';
import CarArt from '../components/CarArt.jsx';
import Landscape from '../components/Landscape.jsx';

const shown = (x) => x.visible !== false;
const fill = (s = '', brand) => s.replace('{brand}', brand.name);

function Logo({ brand }) {
  const mark = brand.mark || 'SR';
  const rest = brand.name.startsWith(mark) ? brand.name.slice(mark.length).trim() : brand.name;
  return (
    <a className="logo" href="/" aria-label={brand.name}>
      <span className="mark"><b>{mark.slice(0, 1)}</b><i>{mark.slice(1)}</i></span>
      <span className="logo-text">
        <strong>{rest}</strong>
        <small>{brand.tagline}</small>
      </span>
    </a>
  );
}

function SectionHead({ t, brand, plate = 'sun' }) {
  return (
    <div className="head">
      <h2 className={`plate ${plate}`}>{fill(t.title, brand)}</h2>
      {t.sub && <p className="head-sub">{t.sub}</p>}
    </div>
  );
}

/* ---------------------------------------------------------------- navigation */
function Navbar({ c, links }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav">
      <div className="container nav-in">
        <Logo brand={c.brand} />
        <div className={'nav-links' + (open ? ' open' : '')} onClick={() => setOpen(false)}>
          {links.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </div>
        <div className="nav-cta">
          <a className="btn btn-sun btn-sm" href={telLink(c.contact.phone)}>
            <Icon name="phone" size={16} /><span>{c.contact.phone}</span>
          </a>
          <button className="burger" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
            <Icon name={open ? 'x' : 'menu'} size={26} />
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ---------------------------------------------------------------------- hero */
function Hero({ c, rides, wa }) {
  const { hero, brand, contact } = c;
  return (
    <header className="hero">
      <div className="container hero-copy">
        <h1>{hero.title}</h1>
        <p className="lead">{hero.subtitle}</p>
        <div className="cta-row">
          <a className="btn btn-sun" href="#enquiry">{hero.cta}</a>
          <a className="btn btn-wa" href={wa(`Hello ${brand.name}, I would like to plan a trip.`)} target="_blank" rel="noreferrer">
            <Icon name="chat" size={18} /> WhatsApp
          </a>
          <a className="btn btn-line" href={telLink(contact.phone)}>
            <Icon name="phone" size={18} /> Call {contact.phone}
          </a>
        </div>
        <p className="brandline">{brand.slogan}</p>
      </div>

      <aside className="hero-note" aria-hidden="true">
        <span className="motto">{brand.motto}</span>
        <span className="caption">{hero.caption}</span>
      </aside>

      {rides.length > 0 ? (
        <div className="scene">
          <Landscape />
          <div className="fleet" id="fleet" style={{ '--n': Math.min(rides.length, 4) }}>
            {rides.map((v, i) => (
              <a
                key={v.id}
                className="ride"
                style={{ '--i': i }}
                href={wa(`Hello ${brand.name}, I want to book the ${v.name}.`)}
                target="_blank"
                rel="noreferrer"
              >
                <CarArt color={v.color} image={v.image} name={v.name} />
                <span className="road" />
                <span className="ride-info">
                  <span className="ribbon">{v.name}</span>
                  <span className="ride-tag">{v.tagline}</span>
                  <span className="ride-meta">
                    {v.seats && <span>{v.seats}</span>}
                    {v.ac && <span>AC</span>}
                  </span>
                  <span className="ride-price">{v.price || 'Call for price'}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="hero-gap" />
      )}
    </header>
  );
}

/* -------------------------------------------------------------- destinations */
function Destinations({ c, items, wa }) {
  const [region, setRegion] = useState('odisha');
  const [tag, setTag] = useState('All');
  const inRegion = items.filter((p) => p.region === region);
  const tags = ['All', ...new Set(inRegion.flatMap((p) => splitTags(p.tags)))];
  const list = tag === 'All' ? inRegion : inRegion.filter((p) => splitTags(p.tags).includes(tag));
  const pick = (r) => { setRegion(r); setTag('All'); };

  return (
    <section className="section" id="destinations">
      <div className="container">
        <SectionHead t={c.titles.packages} brand={c.brand} plate="sun" />

        <div className="regions" role="tablist">
          <button role="tab" aria-selected={region === 'odisha'} className={region === 'odisha' ? 'on' : ''} onClick={() => pick('odisha')}>
            🛕 Odisha tour packages
          </button>
          <button role="tab" aria-selected={region === 'india'} className={region === 'india' ? 'on' : ''} onClick={() => pick('india')}>
            🗺️ Out of Odisha tour packages
          </button>
        </div>

        <div className="filters">
          {tags.map((x) => (
            <button key={x} className={tag === x ? 'on' : ''} onClick={() => setTag(x)}>{x}</button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="empty">Packages for this region are coming soon. Call us and we will plan one for you.</p>
        ) : (
          <div className="tiles">
            {list.map((p, i) => (
              <article className="tile" key={p.id}>
                <div className={`tile-img g${i % 6}`}>
                  {p.image ? (
                    <img src={safeUrl(p.image)} alt={p.name} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <span className="tile-emoji" aria-hidden="true">{p.emoji || '📍'}</span>
                  )}
                  {p.duration && <span className="tile-tag">{p.duration}</span>}
                </div>
                <div className="tile-cap">
                  <h3>{p.name}</h3>
                  {p.subtitle && <span>{p.subtitle}</span>}
                </div>
                <div className="tile-body">
                  {p.description && <p>{p.description}</p>}
                  <div className="tile-foot">
                    <b>{p.price || 'Ask for a quote'}</b>
                    <a href={wa(`Hello ${c.brand.name}, I am interested in the ${p.name} package.`)} target="_blank" rel="noreferrer">Enquire</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------ why us, offer, services */
function Why({ c }) {
  return (
    <section className="section why" id="why">
      <div className="container">
        <SectionHead t={c.titles.features} brand={c.brand} plate="navy" />
        <ul className="perks">
          {c.features.map((f) => (
            <li key={f.id}>
              <span className="perk-ico" aria-hidden="true">{f.icon}</span>
              <div><h3>{f.title}</h3><p>{f.desc}</p></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Offer({ c, wa }) {
  const o = c.offer;
  return (
    <section className="offer">
      <div className="container offer-in">
        <div className="badge"><span aria-hidden="true">👨‍👩‍👧‍👦</span><b>{o.title}</b></div>
        <p>{o.text}</p>
        <a className="btn btn-navy" href={wa(`Hello ${c.brand.name}, I would like a group or family quote.`)} target="_blank" rel="noreferrer">{o.cta}</a>
      </div>
    </section>
  );
}

function Services({ c, wa }) {
  const t = c.titles.services;
  return (
    <section className="band" id="services">
      <div className="container band-in">
        <div className="band-book">
          <h2>{fill(t.title, c.brand)}</h2>
          {t.sub && <p>{t.sub}</p>}
          <a className="bigphone" href={wa('')} target="_blank" rel="noreferrer">
            <Icon name="chat" size={30} /><span>{c.contact.phone}</span>
          </a>
        </div>
        <ul className="svc-list">
          {c.services.map((s) => (
            <li key={s.id}>
              <a href={wa(`Hello ${c.brand.name}, I need help with ${s.title}.`)} target="_blank" rel="noreferrer">
                <span className="svc-ico" aria-hidden="true">{s.icon}</span>
                <b>{s.title}</b>
                <small>{s.desc}</small>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Reviews({ c }) {
  return (
    <section className="section reviews" id="reviews">
      <div className="container">
        <SectionHead t={c.titles.reviews} brand={c.brand} plate="sun" />
        <div className="quotes">
          {c.testimonials.map((r) => (
            <blockquote key={r.id}>
              <p>{r.text}</p>
              <footer><b>{r.name}</b>{r.place && <span>{r.place}</span>}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ enquiry + footer */
function ContactItems({ c, wa }) {
  const k = c.contact;
  const rows = [
    ['phone', 'Call us', k.phone, telLink(k.phone)],
    ['chat', 'WhatsApp', k.whatsapp || k.phone, wa('')],
    k.email && ['mail', 'Email', k.email, `mailto:${k.email}`],
    k.address && ['pin', 'Address', k.address],
    k.hours && ['clock', 'Support', k.hours],
  ].filter(Boolean);
  return rows.map(([icon, label, text, href]) => (
    <li key={label}>
      <span className="ico"><Icon name={icon} size={18} /></span>
      <span>
        <small>{label}</small>
        {href ? <a href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>{text}</a> : <b>{text}</b>}
      </span>
    </li>
  ));
}

function Enquiry({ c, vehicles, packages, wa }) {
  const empty = { name: '', phone: '', from: '', to: '', date: '', pax: '', vehicle: '', note: '' };
  const [f, setF] = useState(empty);
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!f.name.trim() || digits(f.phone).length < 10) {
      setErr('Please enter your name and a 10-digit phone number.');
      return;
    }
    setErr('');
    const lines = [
      `Hello ${c.brand.name}, I would like to enquire about a trip.`,
      `Name: ${f.name}`,
      `Phone: ${f.phone}`,
      f.from && `Travelling from: ${f.from}`,
      f.to && `Destination: ${f.to}`,
      f.date && `Travel date: ${f.date}`,
      f.pax && `Travellers: ${f.pax}`,
      f.vehicle && `Vehicle: ${f.vehicle}`,
      f.note && `Message: ${f.note}`,
    ].filter(Boolean);
    window.open(wa(lines.join('\n')), '_blank', 'noopener');
  };

  return (
    <section className="section enquiry" id="enquiry">
      <div className="container enq">
        <div className="enq-info">
          <h2>{c.titles.enquiry.title}</h2>
          {c.titles.enquiry.sub && <p>{c.titles.enquiry.sub}</p>}
          <ul className="contact-list"><ContactItems c={c} wa={wa} /></ul>
        </div>

        <form className="form" onSubmit={submit} noValidate>
          <div className="form-grid">
            <label>Your name<input value={f.name} onChange={set('name')} autoComplete="name" required /></label>
            <label>Phone number<input value={f.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" required /></label>
            <label>Travelling from<input value={f.from} onChange={set('from')} placeholder="e.g. Bhubaneswar" /></label>
            <label>
              Where to?
              <input value={f.to} onChange={set('to')} list="dest-list" placeholder="Pick or type a place" />
              <datalist id="dest-list">{packages.map((p) => <option key={p.id} value={p.name} />)}</datalist>
            </label>
            <label>Travel date<input type="date" value={f.date} onChange={set('date')} /></label>
            <label>Number of travellers<input value={f.pax} onChange={set('pax')} inputMode="numeric" /></label>
            <label className="full">
              Preferred vehicle
              <select value={f.vehicle} onChange={set('vehicle')}>
                <option value="">Not sure yet</option>
                {vehicles.map((v) => <option key={v.id} value={v.name}>{v.name}</option>)}
              </select>
            </label>
            <label className="full">Anything else?<textarea rows={3} value={f.note} onChange={set('note')} /></label>
          </div>
          {err && <p className="err" role="alert">{err}</p>}
          <button className="btn btn-wa btn-lg" type="submit"><Icon name="chat" size={20} /> Send on WhatsApp</button>
          <p className="fine">This opens WhatsApp with your details filled in, ready to send.</p>
        </form>
      </div>
    </section>
  );
}

function Footer({ c, links, wa }) {
  const { brand, contact: k } = c;
  const socials = [['instagram', k.instagram], ['facebook', k.facebook], ['youtube', k.youtube]].filter((s) => s[1]);
  return (
    <footer className="footer">
      <div className="container foot-grid">
        <div>
          <Logo brand={brand} />
          <p className="foot-motto">{brand.motto}</p>
          {socials.length > 0 && (
            <div className="social">
              {socials.map(([name, url]) => (
                <a key={name} href={safeUrl(url)} target="_blank" rel="noreferrer" aria-label={name}><Icon name={name} size={18} /></a>
              ))}
            </div>
          )}
        </div>
        <div>
          <h4>Explore</h4>
          <ul className="flinks">{links.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul className="contact-list"><ContactItems c={c} wa={wa} /></ul>
        </div>
      </div>
      <div className="container copy">
        <span>© {new Date().getFullYear()} {brand.name}. All rights reserved.</span>
        <span>{brand.tagline}</span>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------------- page */
export default function Landing() {
  // Show the last published copy instantly on repeat visits, then refresh it.
  const [c, setC] = useState(() => { const cached = getCached(); return cached ? withDefaults(cached) : null; });

  useEffect(() => {
    let alive = true;
    const giveUp = setTimeout(() => alive && setC((cur) => cur || withDefaults(null)), 3500);
    fetchContent().then((r) => { if (alive) setC(r.content); });
    return () => { alive = false; clearTimeout(giveUp); };
  }, []);

  useEffect(() => { if (c) document.title = `${c.brand.name} – ${c.brand.tagline}`; }, [c]);

  if (!c) return <div className="splash"><span className="mark big"><b>S</b><i>R</i></span></div>;

  const S = c.sections;
  const wa = (text) => waLink(c.contact.whatsapp || c.contact.phone, text);
  const vehicles = c.vehicles.filter(shown);
  const packages = c.packages.filter(shown);
  const links = [
    S.vehicles && vehicles.length > 0 && ['fleet', 'Our cars'],
    S.packages && packages.length > 0 && ['destinations', 'Destinations'],
    S.features && c.features.length > 0 && ['why', 'Why us'],
    S.services && c.services.length > 0 && ['services', 'Services'],
    S.enquiry && ['enquiry', 'Contact'],
  ].filter(Boolean);

  return (
    <>
      {c.announcement.enabled && c.announcement.text && <div className="announce">{c.announcement.text}</div>}
      <Navbar c={c} links={links} />
      <main>
        <Hero c={c} rides={S.vehicles ? vehicles : []} wa={wa} />
        {S.packages && packages.length > 0 && <Destinations c={c} items={packages} wa={wa} />}
        {S.features && c.features.length > 0 && <Why c={c} />}
        {c.offer.enabled && <Offer c={c} wa={wa} />}
        {S.services && c.services.length > 0 && <Services c={c} wa={wa} />}
        {S.reviews && c.testimonials.length > 0 && <Reviews c={c} />}
        {S.enquiry && <Enquiry c={c} vehicles={vehicles} packages={packages} wa={wa} />}
      </main>
      <Footer c={c} links={links} wa={wa} />
      <a className="wa-float" href={wa('Hello! I would like to know more about your tour packages.')} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <Icon name="chat" size={28} />
      </a>
    </>
  );
}
