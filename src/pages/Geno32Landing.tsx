import { type FormEvent, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import site from '../data/site.json'
import geno32Data from '../data/geno32.json'

type FormState = {
  name: string
  phone: string
  area: string
  symptom: string
}

type IconProps = {
  className?: string
}

const WhatsAppIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 32 32"
    className={className}
    fill="currentColor"
  >
    <path d="M19.11 17.205c-.274-.137-1.63-.803-1.882-.893-.252-.091-.435-.137-.617.137-.183.274-.708.893-.868 1.077-.16.183-.32.206-.594.069-.274-.137-1.156-.426-2.203-1.357-.815-.726-1.366-1.624-1.525-1.898-.16-.274-.017-.422.12-.559.123-.122.274-.32.411-.48.137-.16.183-.274.274-.457.091-.183.046-.343-.023-.48-.069-.137-.617-1.49-.846-2.044-.224-.538-.452-.466-.617-.475l-.526-.009c-.183 0-.48.069-.731.343-.252.274-.96.937-.96 2.285s.983 2.652 1.12 2.835c.137.183 1.935 2.957 4.692 4.144.656.283 1.169.452 1.568.578.659.21 1.259.181 1.733.11.529-.079 1.63-.663 1.859-1.304.229-.64.229-1.189.16-1.304-.069-.114-.251-.183-.526-.32z" />
    <path d="M26.657 5.343A12.92 12.92 0 0 0 16.002 1.5C9.13 1.5 3.52 7.11 3.52 13.982c0 2.234.583 4.414 1.69 6.338L3.52 30.5l10.405-1.647a12.42 12.42 0 0 0 6.077 1.553h.001c6.872 0 12.482-5.61 12.482-12.482a12.92 12.92 0 0 0-3.828-9.581zm-10.655 22.08h-.001a10.38 10.38 0 0 1-5.3-1.458l-.38-.226-6.173.977.97-6.02-.248-.39a10.44 10.44 0 1 1 11.132 7.117z" />
  </svg>
)

const buildWhatsAppLink = (message: string) => {
  const base = `https://wa.me/${site.whatsappNumber}`
  return `${base}?text=${encodeURIComponent(message)}`
}

const trackEvent = (action: string, label: string) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: 'conversion',
      event_label: label,
    })
  }
}

const scrollToVideo = () => {
  const videoSection = document.getElementById('video-section')
  if (videoSection) {
    videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function Geno32Landing() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    phone: '',
    area: '',
    symptom: '',
  })

  // Agregar meta noindex
  useEffect(() => {
    // Verificar si ya existe el meta robots
    let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement
    if (!metaRobots) {
      metaRobots = document.createElement('meta')
      metaRobots.name = 'robots'
      document.head.appendChild(metaRobots)
    }
    metaRobots.content = 'noindex, nofollow'

    // Actualizar title y description
    document.title = geno32Data.metaTitle
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', geno32Data.metaDescription)
    }
  }, [])

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = `Hola, soy ${formData.name}. Quiero evaluar mi caso para el tratamiento GENO32. Mis síntomas son ${formData.symptom}. Mi barrio es ${formData.area}. Mi teléfono es ${formData.phone}.`
    trackEvent('whatsapp_click', 'geno32_formulario')
    window.open(buildWhatsAppLink(message), '_blank', 'noopener,noreferrer')
  }

  const handleWhatsAppClick = (label: string) => {
    trackEvent('whatsapp_click', label)
  }

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center">
            <img
              src="/img/logo.png"
              alt="Maida Smirlian Odontología"
              className="h-12 w-auto md:h-14"
            />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
            <Link to="/#servicios" className="transition hover:text-petrol">
              Servicios
            </Link>
            <Link to="/#contacto" className="transition hover:text-petrol">
              Contacto
            </Link>
          </nav>
          <a
            className="btn-primary"
            href={buildWhatsAppLink(site.whatsappDefaultMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleWhatsAppClick('header')}
          >
            <WhatsAppIcon className="h-4 w-4" />
            {site.ctaWhatsAppLabel}
          </a>
        </div>
      </header>

      <main className="pb-24">
        {/* HERO */}
        <section className="bg-light-gray">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mint-dark">
                Tratamiento personalizado
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-petrol md:text-5xl">
                {geno32Data.hero.title}
              </h1>
              <p className="mt-4 text-base text-slate-600 md:text-lg">
                {geno32Data.hero.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  className="btn-primary"
                  href={buildWhatsAppLink(
                    `Hola, quiero evaluar mi caso para el tratamiento GENO32.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleWhatsAppClick('hero_primary')}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {geno32Data.hero.ctaPrimary}
                </a>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={scrollToVideo}
                >
                  {geno32Data.hero.ctaSecondary}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* VIDEO */}
        <section id="video-section" className="mx-auto w-full max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-mint-dark">
              Presentación clínica
            </p>
            <h2 className="section-title mt-2 text-center">
              Presentación clínica del tratamiento GENO32
            </h2>
            <div className="mt-8 aspect-video overflow-hidden rounded-3xl bg-slate-100 shadow-soft">
              {geno32Data.youtubeVideoUrl !== 'YOUTUBE_VIDEO_URL' ? (
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${geno32Data.youtubeVideoUrl.replace(
                    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/,
                    '$1',
                  )}`}
                  title="Presentación clínica GENO32"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">
                  <p className="text-center">
                    Video de YouTube<br />
                    (URL pendiente de configuración)
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* EL PROBLEMA */}
        <section className="bg-light-gray py-20">
          <div className="mx-auto w-full max-w-6xl px-5">
            <h2 className="section-title">{geno32Data.problem.title}</h2>
            <p className="section-subtitle">
              Entender qué está pasando es el primer paso para buscar una solución adecuada.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {geno32Data.problem.sections.map((section, index) => (
                <div key={index} className="card">
                  <h3 className="text-lg font-semibold text-petrol">{section.title}</h3>
                  <p className="mt-3 text-sm text-slate-600">{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* QUÉ ES GENO32 */}
        <section className="mx-auto w-full max-w-6xl px-5 py-20">
          <h2 className="section-title">{geno32Data.whatIs.title}</h2>
          <p className="section-subtitle">{geno32Data.whatIs.description}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {geno32Data.whatIs.features.map((feature, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-petrol">{feature.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{feature.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SEGURIDAD */}
        {geno32Data.safety && (
          <section className="mx-auto w-full max-w-6xl px-5 py-20">
            <h2 className="section-title">{geno32Data.safety.title}</h2>
            <p className="section-subtitle">{geno32Data.safety.description}</p>
            <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">
              <ul className="space-y-3">
                {geno32Data.safety.points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-dark" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* POR QUÉ ES DIFERENTE */}
        <section className="bg-light-gray py-20">
          <div className="mx-auto w-full max-w-6xl px-5">
            <h2 className="section-title">{geno32Data.whyDifferent.title}</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {geno32Data.whyDifferent.comparisons.map((comparison, index) => (
                <div key={index} className="card">
                  <h3 className="text-lg font-semibold text-petrol">{comparison.title}</h3>
                  <p className="mt-3 text-sm text-slate-600">{comparison.content}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">
              <p className="text-sm font-semibold text-petrol mb-4">Enfatizamos:</p>
              <ul className="space-y-2">
                {geno32Data.whyDifferent.emphasis.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-dark" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* PARA QUIÉN SÍ / PARA QUIÉN NO */}
        <section className="mx-auto w-full max-w-6xl px-5 py-20">
          <h2 className="section-title">{geno32Data.whoIsFor.title}</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="card">
              <h3 className="text-lg font-semibold text-petrol mb-4">Para quién sí</h3>
              <ul className="space-y-3">
                {geno32Data.whoIsFor.forWho.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-dark" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card border-petrol/20">
              <h3 className="text-lg font-semibold text-petrol mb-4">Para quién no</h3>
              <ul className="space-y-3">
                {geno32Data.whoIsFor.notForWho.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 rounded-2xl border border-mint-dark/30 bg-mint-light/30 p-6 text-center">
            <p className="text-sm text-slate-700">{geno32Data.whoIsFor.note}</p>
          </div>
        </section>

        {/* PROCESO DE ATENCIÓN */}
        <section className="bg-light-gray py-20">
          <div className="mx-auto w-full max-w-6xl px-5">
            <h2 className="section-title">{geno32Data.process.title}</h2>
            <p className="section-subtitle">
              Un proceso claro, con evaluación profesional y seguimiento cercano.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {geno32Data.process.steps.map((step) => (
                <div key={step.step} className="card">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mint-dark text-lg font-semibold text-white">
                    {step.step}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-petrol">{step.title}</h3>
                  <p className="mt-3 text-sm text-slate-600">{step.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        {geno32Data.faqs && geno32Data.faqs.length > 0 && (
          <section className="bg-light-gray py-20">
            <div className="mx-auto w-full max-w-6xl px-5">
              <h2 className="section-title">Preguntas frecuentes</h2>
              <p className="section-subtitle">
                Respondemos las consultas más comunes sobre GENO32 y el tratamiento del sueño.
              </p>
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {geno32Data.faqs.map((faq) => (
                  <details key={faq.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
                    <summary className="cursor-pointer text-sm font-semibold text-petrol">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-sm text-slate-600">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA FINAL - FORMULARIO */}
        <section className="mx-auto w-full max-w-4xl px-5 py-20">
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft md:p-12">
            <h2 className="section-title text-center">{geno32Data.form.title}</h2>
            <p className="section-subtitle text-center">{geno32Data.form.subtitle}</p>
            <form onSubmit={handleFormSubmit} className="mt-8">
              <div className="grid gap-4">
                <label className="text-sm font-semibold text-petrol">
                  {geno32Data.form.fields.name}
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, name: event.target.value }))
                    }
                    required
                  />
                </label>
                <label className="text-sm font-semibold text-petrol">
                  {geno32Data.form.fields.phone}
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    required
                  />
                </label>
                <label className="text-sm font-semibold text-petrol">
                  {geno32Data.form.fields.area}
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400"
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, area: event.target.value }))
                    }
                    required
                  />
                </label>
                <label className="text-sm font-semibold text-petrol">
                  {geno32Data.form.fields.symptom}
                  <select
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800"
                    name="symptom"
                    value={formData.symptom}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, symptom: event.target.value }))
                    }
                    required
                  >
                    <option value="">Seleccioná una opción</option>
                    {geno32Data.form.symptoms.map((symptom) => (
                      <option key={symptom} value={symptom}>
                        {symptom}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button className="btn-primary mt-6 w-full" type="submit">
                <WhatsAppIcon className="h-4 w-4" />
                {geno32Data.form.ctaLabel}
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 bg-white py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-base font-semibold text-petrol">{site.name}</p>
            <p className="mt-2 text-sm text-slate-600">{site.address}</p>
          </div>
          <div className="flex flex-col gap-4">
            <a
              className="btn-primary"
              href={buildWhatsAppLink(site.whatsappDefaultMessage)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleWhatsAppClick('footer')}
            >
              <WhatsAppIcon className="h-4 w-4" />
              {site.ctaWhatsAppLabel}
            </a>
            <div className="flex gap-4 text-sm text-slate-600">
              <a
                className="inline-flex items-center gap-2 transition hover:text-petrol"
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9A4.5 4.5 0 0 1 16.5 21h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3zm0 1.5A3 3 0 0 0 4.5 7.5v9A3 3 0 0 0 7.5 19.5h9a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3h-9zm10.2 1.8a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zM12 7.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2zm0 1.5A3.3 3.3 0 1 0 15.3 12 3.3 3.3 0 0 0 12 8.7z" />
                </svg>
                Instagram
              </a>
              <a
                className="inline-flex items-center gap-2 transition hover:text-petrol"
                href={site.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M13.5 8.25V6.6c0-.6.3-.9.9-.9h1.35V3H14.4c-1.95 0-3.15 1.2-3.15 3.15v2.1H9V10.8h2.25V21h2.55V10.8h2.1l.45-2.55h-2.55z" />
                </svg>
                Facebook
              </a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 w-full max-w-6xl px-5 text-[0.75rem] text-slate-400">
          <a
            href="https://structura.com.ar/"
            className="transition hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Diseño y desarrollo por Structura
          </a>
        </div>
      </footer>

      <a
        href={buildWhatsAppLink(site.whatsappDefaultMessage)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleWhatsAppClick('floating')}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-mint-dark text-white shadow-soft transition hover:scale-105"
        aria-label="Escribinos por WhatsApp"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </div>
  )
}
