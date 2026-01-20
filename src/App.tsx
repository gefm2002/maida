import { type FormEvent, useEffect, useState } from 'react'
import site from './data/site.json'
import services from './data/services.json'
import gallery from './data/gallery.json'
import testimonials from './data/testimonials.json'
import faqs from './data/faqs.json'

type FormState = {
  name: string
  phone: string
  area: string
  reason: string
}

type Service = {
  id: string
  slug: string
  title: string
  description: string
  ctaLabel: string
  ctaMessage: string
  isActive: boolean
  order: number
  image: string
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

function App() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    phone: '',
    area: '',
    reason: '',
  })
  const [selectedService, setSelectedService] = useState<string>('')

  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_ID
    if (!gaId || gaId === 'VITE_GA_ID') {
      return
    }

    const existingScript = document.querySelector('script[data-ga="true"]')
    if (existingScript) {
      return
    }

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    script.dataset.ga = 'true'
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag =
      window.gtag ||
      ((...args: unknown[]) => {
        window.dataLayer?.push(args)
      })
    window.gtag('js', new Date())
    window.gtag('config', gaId)
  }, [])

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const reason = formData.reason || selectedService || 'consulta general'
    const message = `Hola, soy ${formData.name}. Quiero consultar por ${reason}. Mi barrio es ${formData.area}. Mi teléfono es ${formData.phone}.`
    trackEvent('whatsapp_click', 'contacto_formulario')
    window.open(buildWhatsAppLink(message), '_blank', 'noopener,noreferrer')
  }

  const handleWhatsAppClick = (label: string) => {
    trackEvent('whatsapp_click', label)
  }

  const handleBookingClick = (label: string) => {
    trackEvent('reservar_click', label)
  }

  const handleServiceClick = (service: Service) => {
    setSelectedService(service.title)
    setFormData((prev) => ({
      ...prev,
      reason: service.title,
    }))
    trackEvent('whatsapp_click', `servicio_${service.slug}`)
  }

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center">
            <img
              src="/img/logo.png"
              alt="Maida Smirlian Odontología"
              className="h-12 w-auto md:h-14"
            />
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
            <a href="#servicios" className="transition hover:text-petrol">
              Servicios
            </a>
            <a href="#galeria" className="transition hover:text-petrol">
              Galería
            </a>
            <a href="#testimonios" className="transition hover:text-petrol">
              Testimonios
            </a>
            <a href="#faqs" className="transition hover:text-petrol">
              FAQs
            </a>
            <a href="#reservas" className="transition hover:text-petrol">
              Reservas
            </a>
            <a href="#contacto" className="transition hover:text-petrol">
              Contacto
            </a>
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
        <section className="bg-light-gray">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 md:grid-cols-2 md:items-center md:py-28">
      <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mint-dark">
                Recoleta · CABA
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-petrol md:text-5xl">
                Ortodoncia y salud bucal con atención personalizada en Recoleta
              </h1>
              <p className="mt-4 text-base text-slate-600 md:text-lg">
                Un consultorio cuidado, con acompañamiento humano y resultados visibles.
                Te explicamos cada paso para que te sientas seguro desde el primer día.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  className="btn-primary"
                  href={buildWhatsAppLink(site.whatsappDefaultMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleWhatsAppClick('hero')}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {site.ctaWhatsAppLabel}
                </a>
                <a
                  className="btn-secondary"
                  href={site.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleBookingClick('hero')}
                >
                  Reservar turno
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-center overflow-hidden rounded-3xl bg-white p-6 shadow-soft">
                <img
                  src={site.heroImage}
                  alt="Maida Smirlian Odontología"
                  className="h-72 w-full object-contain md:h-96"
                />
              </div>
              <div className="absolute -bottom-6 left-6 max-w-xs rounded-2xl bg-white p-4 shadow-soft">
                <p className="text-sm font-semibold text-petrol">
                  Seguimiento cercano y resultados reales
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Planes de tratamiento con controles periódicos y comunicación clara.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="servicios" className="mx-auto w-full max-w-6xl px-5 py-20">
          <h2 className="section-title">Servicios</h2>
          <p className="section-subtitle">
            Tratamientos pensados para cuidarte hoy y proyectar una sonrisa saludable a largo plazo.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(services as Service[])
              .filter((service) => service.isActive)
              .sort((a, b) => a.order - b.order)
              .map((service) => (
                <div key={service.id} className="card">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-40 w-full rounded-2xl object-cover"
                    loading="lazy"
                  />
                  <h3 className="mt-4 text-lg font-semibold text-petrol">{service.title}</h3>
                  <p className="mt-3 text-sm text-slate-600">{service.description}</p>
                  <a
                    className="btn-secondary mt-6"
                    href={buildWhatsAppLink(service.ctaMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleServiceClick(service)}
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    {service.ctaLabel}
        </a>
      </div>
              ))}
          </div>
        </section>

        <section id="galeria" className="bg-light-gray py-20">
          <div className="mx-auto w-full max-w-6xl px-5">
            <h2 className="section-title">Galería</h2>
            <p className="section-subtitle">
              Antes y después, consultorio cuidado y una atención que se nota en cada detalle.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {gallery.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-soft">
                  <img src={item.imageUrl} alt={item.title} className="h-48 w-full object-cover" />
                  <div className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-mint-dark">
                      {item.type}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-petrol">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonios" className="mx-auto w-full max-w-6xl px-5 py-20">
          <h2 className="section-title">Testimonios</h2>
          <p className="section-subtitle">
            Historias reales de pacientes que priorizan confianza, claridad y resultados visibles.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="card">
                <p className="text-sm text-slate-600">“{testimonial.text}”</p>
                <p className="mt-4 text-sm font-semibold text-petrol">
                  {testimonial.name} · {testimonial.neighborhood}
        </p>
      </div>
            ))}
          </div>
        </section>

        <section id="faqs" className="bg-light-gray py-20">
          <div className="mx-auto w-full max-w-6xl px-5">
            <h2 className="section-title">Preguntas frecuentes</h2>
            <p className="section-subtitle">
              Respondemos las consultas más comunes para que tomes decisiones con tranquilidad.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {faqs.map((faq) => (
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

        <section id="reservas" className="mx-auto w-full max-w-6xl px-5 py-20">
          <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <h2 className="section-title">Reservas</h2>
              <p className="section-subtitle">
                Coordiná tu turno de forma simple. Te guiamos en el primer contacto y te contamos
                cómo sigue cada etapa del tratamiento.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                <li>1. Escribinos por WhatsApp y contanos tu consulta.</li>
                <li>2. Te proponemos opciones de día y horario según disponibilidad.</li>
                <li>3. Confirmamos el turno y te enviamos indicaciones previas.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">
              <p className="text-sm font-semibold text-petrol">Reservá tu visita</p>
              <p className="mt-2 text-sm text-slate-600">
                Reservá online con nuestro calendario de Google.
              </p>
              <a
                className="btn-primary mt-6 w-full"
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleBookingClick('reservas')}
              >
                Reservar turno
              </a>
            </div>
          </div>
        </section>

        <section id="contacto" className="bg-light-gray py-20">
          <div className="mx-auto w-full max-w-6xl px-5">
            <h2 className="section-title">Contacto</h2>
            <p className="section-subtitle">
              WhatsApp es nuestro canal principal. Escribinos y respondemos a la brevedad.
            </p>
            <div className="mt-10 grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
              <form onSubmit={handleFormSubmit} className="rounded-3xl bg-white p-8 shadow-soft">
                <div className="grid gap-4">
                  <label className="text-sm font-semibold text-petrol">
                    Nombre y apellido
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
                    Teléfono
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
                    Barrio / zona
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
                    Motivo de consulta
                    <textarea
                      className="mt-2 min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400"
                      name="reason"
                      value={formData.reason || selectedService}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, reason: event.target.value }))
                      }
                      required
                    />
                  </label>
                </div>
                <button className="btn-primary mt-6 w-full" type="submit">
                  <WhatsAppIcon className="h-4 w-4" />
                  Enviar por WhatsApp
                </button>
              </form>

              <div className="space-y-6">
                <div className="rounded-3xl bg-white p-6 shadow-soft">
                  <p className="text-sm font-semibold text-petrol">Dirección</p>
                  <p className="mt-2 text-sm text-slate-600">{site.address}</p>
                  <a
                    className="btn-secondary mt-5"
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cómo llegar
                  </a>
                </div>
                <div className="overflow-hidden rounded-3xl shadow-soft">
                  <iframe
                    title="Mapa de Maida Smirlian Odontología"
                    src={site.mapsEmbedUrl}
                    className="h-64 w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-soft">
                  <p className="text-sm font-semibold text-petrol">Redes</p>
                  <div className="mt-3 flex gap-4 text-sm text-slate-600">
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
            </div>
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

export default App
