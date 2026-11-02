import { useState } from 'react'
import './App.css'

const delatnosti = [
  { id: 'restoran', name: 'Restoran / picerija' },
  { id: 'kafic', name: 'Kafić' },
  { id: 'pekara', name: 'Pekara' },
  { id: 'auto', name: 'Auto-servis' },
  { id: 'frizer', name: 'Frizerski / beauty salon' },
  { id: 'stomatolog', name: 'Stomatološka ordinacija' },
  { id: 'vulkanizer', name: 'Vulkanizer' },
  { id: 'fitness', name: 'Fitness' },
  { id: 'hotel', name: 'Hotel i apartmani' },
  { id: 'mesara', name: 'Mesara i delikates' },
]

function App() {
  const [delatnost, setDelatnost] = useState(delatnosti[0])
  const [ninaMsg, setNinaMsg] = useState('')
  const [ninaReply, setNinaReply] = useState('')
  const [loading, setLoading] = useState(false)

  const askNina = async () => {
    if (!ninaMsg.trim()) return
    setLoading(true)
    setNinaReply('Nina razmišlja...')
    try {
      const key = import.meta.env.VITE_GROQ_API_KEY
      if (!key) {
        setNinaReply('Unesi GROQ_API_KEY u .env fajl i restartuj server.')
        setLoading(false)
        return
      }
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: 'Ti si Nina, AI asistentkinja za lokalne biznise u Somboru. Odgovaraš kratko, jasno, na srpskom. Nikad ne izmišljaš podatke. Vodiš ka pozivu ili upitu. Javno kažeš da si AI.' },
            { role: 'user', content: ninaMsg }
          ],
          temperature: 0.3
        })
      })
      const data = await res.json()
      setNinaReply(data.choices?.[0]?.message?.content || 'Greška u odgovoru.')
    } catch (e) {
      setNinaReply('Greška pri komunikaciji sa Ninom. Proveri API key.')
    }
    setLoading(false)
  }

  return (
    <div className="app">
      <header>
        <div className="container header">
          <div className="logo">NIDZP <span>MARKETING</span></div>
          <nav>
            <a href="#demo">Demo</a>
            <a href="#paketi">Paketi</a>
            <a href="tel:0637456770">063 745 6770</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <p className="eyebrow">SOMBOR I OKOLINA · SAJTOVI ZA LOKALNE BIZNISE</p>
          <h1>Sajt za vaš lokal<br />za 20 sekundi</h1>
          <p className="lead">Izaberite delatnost — odmah vidite pravi, klikabilan demo. Bez prijave. Bez obaveze. Transparentne cene.</p>
          
          <div className="prices">
            <div className="price-box">
              <strong>600 €</strong>
              <small>Sajt · godišnje</small>
            </div>
            <div className="price-box">
              <strong>2.500 €</strong>
              <small>Premium + Nina · godišnje</small>
            </div>
          </div>
          <p className="note">Ista cena pri svakoj obnovi. Bez naknade za izradu. Bez skrivenih troškova.</p>
          <a href="#demo" className="btn">Pogledajte svoj demo</a>
          <a href="tel:0637456770" className="btn outline">Pozovite</a>
        </div>
      </section>

      <section id="demo" className="section">
        <div className="container">
          <h2>Ovako bi izgledao vaš sajt</h2>
          <div className="selector">
            <select value={delatnost.id} onChange={e => setDelatnost(delatnosti.find(d => d.id === e.target.value))}>
              {delatnosti.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <div className="demo-preview">
              <strong>DEMO ZA: {delatnost.name}</strong>
              <p>Otvoren demo. Bez prijave. Bez obaveze.</p>
              <small>FIKTIVNI NIDZP DEMO — nije stvarna firma.</small>
            </div>
            <a href={`https://nidzpmar.vercel.app/demo/${delatnost.id}/paket-1/`} target="_blank" rel="noreferrer" className="btn">Otvorite ceo demo</a>
          </div>
        </div>
      </section>

      <section id="paketi" className="section alt">
        <div className="container">
          <h2>Dva paketa · jasne cene</h2>
          <div className="packages">
            <div className="package">
              <h3>Sajt</h3>
              <div className="price">600 € <small>/ godišnje</small></div>
              <ul>
                <li>Vidljivost na Google-u</li>
                <li>Radi na telefonu i računaru</li>
                <li>Jedan jasan poziv na akciju</li>
                <li>Održavanje uključeno</li>
                <li>Ista cena pri obnovi</li>
              </ul>
            </div>
            <div className="package premium">
              <h3>Premium sa Ninom</h3>
              <div className="price">2.500 € <small>/ godišnje</small></div>
              <ul>
                <li>Sve iz paketa Sajt</li>
                <li>Više stranica po meri</li>
                <li>Nina AI asistentkinja</li>
                <li>Vi odobravate sadržaj</li>
                <li>Ista cena pri obnovi</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Nina · vaša AI asistentkinja</h2>
          <p>Odgovara dok vi radite. Javno kaže da je AI. Odgovara samo iz podataka koje vi odobrite.</p>
          <div className="nina-box">
            <input 
              value={ninaMsg} 
              onChange={e => setNinaMsg(e.target.value)} 
              placeholder="Pitajte Ninu nešto..."
              onKeyDown={e => e.key === 'Enter' && askNina()}
            />
            <button onClick={askNina} disabled={loading} className="btn">{loading ? '...' : 'Pitaj Ninu'}</button>
            {ninaReply && <div className="nina-reply">{ninaReply}</div>}
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>NIDZP AI Marketing · Sombor i okolina · 063 745 6770</p>
          <p>nidzpaimarketing@gmail.com</p>
        </div>
      </footer>
    </div>
  )
}

export default App
