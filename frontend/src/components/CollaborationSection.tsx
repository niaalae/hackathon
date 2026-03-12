import { useTranslation } from 'react-i18next'
import { Users, Calendar, DollarSign, Camera, CheckCircle2 } from 'lucide-react'

export default function CollaborationSection() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const benefits = [
    {
      icon: <Calendar className="h-5 w-5 text-orange-500" />,
      text: t('colab.benefit1'),
    },
    {
      icon: <DollarSign className="h-5 w-5 text-orange-500" />,
      text: t('colab.benefit2'),
    },
    {
      icon: <Camera className="h-5 w-5 text-orange-500" />,
      text: t('colab.benefit3'),
    },
    {
      icon: <CheckCircle2 className="h-5 w-5 text-orange-500" />,
      text: t('colab.benefit4'),
    },
  ]

  return (
    <section
      className="relative z-10 -mt-[12svh] overflow-hidden bg-white pt-[12svh] py-20 lg:py-32"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[36px] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:p-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-orange-100/35 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-sky-100/35 blur-3xl" />
            <div className="absolute left-1/2 top-[-80px] h-52 w-52 -translate-x-1/2 rounded-full bg-orange-50/40 blur-3xl" />
          </div>

          <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="flex flex-col gap-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-[11px] font-semibold text-zinc-700 shadow-sm sm:text-xs">
                <Users className="h-3.5 w-3.5 text-orange-500" />
                {t('colab.badge')}
              </div>

              <h2 className="text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-950 lg:text-5xl">
                {t('colab.title')} <br />
                <span className="text-zinc-400">{t('colab.subtitle')}</span>
              </h2>

              <p className="max-w-lg text-lg leading-relaxed text-zinc-600">
                {t('colab.desc')}
              </p>

              <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm transition-transform hover:scale-[1.02]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-50">
                      {benefit.icon}
                    </div>
<<<<<<< HEAD

                    <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                        {/* Left Column: Text Content */}
                        <div className="flex flex-col gap-6">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white/85 px-4 py-2 text-[11px] font-semibold text-zinc-700 shadow-sm backdrop-blur sm:text-xs">
                                <Users className="h-3.5 w-3.5 text-orange-500" />
                                {t('colab.badge')}
                            </div>

                            <h2 className="text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-950 lg:text-5xl">
                                {t('colab.title')} <br />
                                <span className="text-zinc-500/50">{t('colab.subtitle')}</span>
                            </h2>

                            <p className="max-w-lg text-lg leading-relaxed text-zinc-600">
                                {t('colab.desc')}
                            </p>

                            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-center gap-3 rounded-2xl bg-white/60 p-4 shadow-sm backdrop-blur-sm transition-transform hover:scale-[1.02]">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7f2ea]">
                                            {benefit.icon}
                                        </div>
                                        <span className="text-sm font-medium text-zinc-800">{benefit.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Column: Phone Mockup */}
                        <div className="relative flex justify-center lg:justify-end">
                            <div className="relative z-10 w-full max-w-[440px] transition-transform duration-500 hover:scale-[1.02]">
                                <div className="overflow-hidden rounded-[42px] border-[8px] border-zinc-900 shadow-2xl">
                                    <img
                                        src="/assets/images/collaboration_mockup.png"
                                        alt="Trip Collaboration App Mockup"
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* Floating elements to emphasize the design */}
                                <div className="absolute -right-6 top-1/4 hidden rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-md lg:block">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs font-bold text-zinc-800">{t('colab.activeFriends')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background accent circle */}
                        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-sky-400/10 to-transparent blur-2xl" />
                    </div>
                </div>
=======
                    <span className="text-sm font-medium text-zinc-800">
                      {benefit.text}
                    </span>
                  </li>
                ))}
              </ul>
>>>>>>> 6e02adb (refixing the bg color for hero and second section)
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative z-10 w-full max-w-[440px] transition-transform duration-500 hover:scale-[1.02]">
                <div className="overflow-hidden rounded-[42px] border-[8px] border-zinc-900 bg-white shadow-2xl">
                  <img
                    src="/assets/images/collaboration_mockup.png"
                    alt="Trip Collaboration App Mockup"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="absolute -right-6 top-1/4 hidden rounded-2xl border border-zinc-100 bg-white p-4 shadow-xl lg:block">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    <span className="text-xs font-bold text-zinc-800">
                      {t('colab.activeFriends')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-sky-200/20 to-transparent blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}