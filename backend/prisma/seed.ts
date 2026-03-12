import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as bcrypt from 'bcrypt'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })

const MOROCCO_REGIONS = [
  'region.tangier_tetouan_al_hoceima',
  'region.oriental',
  'region.fes_meknes',
  'region.rabat_sale_kenitra',
  'region.beni_mellal_khenifra',
  'region.casablanca_settat',
  'region.marrakesh_safi',
  'region.draa_tafilalet',
  'region.souss_massa',
  'region.guelmim_oued_noun',
  'region.laayoune_sakia_el_hamra',
  'region.dakhla_oued_ed_dahab',
] as const

const MOROCCO_CITIES = [
  { name_key: 'city.al_hoceima', region_key: 'region.tangier_tetouan_al_hoceima', coords: { lat: 35.245114, lng: -3.930186 }, images: [] },
  { name_key: 'city.fnideq', region_key: 'region.tangier_tetouan_al_hoceima', coords: { lat: 35.839209, lng: -5.361425 }, images: [] },
  { name_key: 'city.ksar_el_kebir', region_key: 'region.tangier_tetouan_al_hoceima', coords: { lat: 34.999218, lng: -5.898724 }, images: [] },
  { name_key: 'city.larache', region_key: 'region.tangier_tetouan_al_hoceima', coords: { lat: 35.195233, lng: -6.152913 }, images: [] },
  { name_key: 'city.m_diq', region_key: 'region.tangier_tetouan_al_hoceima', coords: { lat: 35.68336, lng: -5.323216 }, images: [] },
  { name_key: 'city.martil', region_key: 'region.tangier_tetouan_al_hoceima', coords: { lat: 35.617441, lng: -5.274154 }, images: [] },
  { name_key: 'city.ouazzane', region_key: 'region.tangier_tetouan_al_hoceima', coords: { lat: 34.796757, lng: -5.578493 }, images: [] },
  { name_key: 'city.tangier', region_key: 'region.tangier_tetouan_al_hoceima', coords: { lat: 35.76963, lng: -5.803352 }, images: [] },
  { name_key: 'city.tetouan', region_key: 'region.tangier_tetouan_al_hoceima', coords: { lat: 35.570175, lng: -5.374278 }, images: [] },
  { name_key: 'city.beni_ansar', region_key: 'region.oriental', coords: { lat: 35.259687, lng: -2.933644 }, images: [] },
  { name_key: 'city.berkane', region_key: 'region.oriental', coords: { lat: 34.926676, lng: -2.329409 }, images: [] },
  { name_key: 'city.guercif', region_key: 'region.oriental', coords: { lat: 34.225576, lng: -3.352345 }, images: [] },
  { name_key: 'city.nador', region_key: 'region.oriental', coords: { lat: 35.173992, lng: -2.92812 }, images: [] },
  { name_key: 'city.oujda', region_key: 'region.oriental', coords: { lat: 34.677874, lng: -1.929306 }, images: [] },
  { name_key: 'city.taourirt', region_key: 'region.oriental', coords: { lat: 34.413438, lng: -2.893825 }, images: [] },
  { name_key: 'city.azrou', region_key: 'region.fes_meknes', coords: { lat: 35.157249, lng: -3.768611 }, images: [] },
  { name_key: 'city.fes', region_key: 'region.fes_meknes', coords: { lat: 34.034653, lng: -5.016193 }, images: [] },
  { name_key: 'city.meknes', region_key: 'region.fes_meknes', coords: { lat: 33.898413, lng: -5.532158 }, images: [] },
  { name_key: 'city.sefrou', region_key: 'region.fes_meknes', coords: { lat: 33.824898, lng: -4.833336 }, images: [] },
  { name_key: 'city.taza', region_key: 'region.fes_meknes', coords: { lat: 34.230155, lng: -4.010104 }, images: [] },
  { name_key: 'city.kenitra', region_key: 'region.rabat_sale_kenitra', coords: { lat: 34.26457, lng: -6.570169 }, images: [] },
  { name_key: 'city.khemisset', region_key: 'region.rabat_sale_kenitra', coords: { lat: 33.830287, lng: -6.072605 }, images: [] },
  { name_key: 'city.rabat', region_key: 'region.rabat_sale_kenitra', coords: { lat: 34.021845, lng: -6.840893 }, images: [] },
  { name_key: 'city.sale', region_key: 'region.rabat_sale_kenitra', coords: { lat: 34.044889, lng: -6.814017 }, images: [] },
  { name_key: 'city.sidi_kacem', region_key: 'region.rabat_sale_kenitra', coords: { lat: 34.226412, lng: -5.711434 }, images: [] },
  { name_key: 'city.sidi_slimane', region_key: 'region.rabat_sale_kenitra', coords: { lat: 34.259878, lng: -5.927253 }, images: [] },
  { name_key: 'city.skhirat', region_key: 'region.rabat_sale_kenitra', coords: { lat: 33.850672, lng: -7.028026 }, images: [] },
  { name_key: 'city.souk_el_arbaa', region_key: 'region.rabat_sale_kenitra', coords: { lat: 34.676523, lng: -5.992617 }, images: [] },
  { name_key: 'city.temara', region_key: 'region.rabat_sale_kenitra', coords: { lat: 33.917166, lng: -6.923804 }, images: [] },
  { name_key: 'city.tifelt', region_key: 'region.rabat_sale_kenitra', coords: { lat: 33.540316, lng: -7.594151 }, images: [] },
  { name_key: 'city.beni_mellal', region_key: 'region.beni_mellal_khenifra', coords: { lat: 32.334193, lng: -6.353335 }, images: [] },
  { name_key: 'city.fquih_ben_salah', region_key: 'region.beni_mellal_khenifra', coords: { lat: 32.421215, lng: -6.747078 }, images: [] },
  { name_key: 'city.khenifra', region_key: 'region.beni_mellal_khenifra', coords: { lat: 32.935772, lng: -5.66965 }, images: [] },
  { name_key: 'city.khouribga', region_key: 'region.beni_mellal_khenifra', coords: { lat: 32.885648, lng: -6.908798 }, images: [] },
  { name_key: 'city.oued_zem', region_key: 'region.beni_mellal_khenifra', coords: { lat: 32.862504, lng: -6.571054 }, images: [] },
  { name_key: 'city.souk_sebt_ouled_nemma', region_key: 'region.beni_mellal_khenifra', coords: { lat: 32.292171, lng: -6.593528 }, images: [] },
  { name_key: 'city.ain_harrouda', region_key: 'region.casablanca_settat', coords: { lat: 33.635372, lng: -7.451398 }, images: [] },
  { name_key: 'city.benslimane', region_key: 'region.casablanca_settat', coords: { lat: 33.61239, lng: -7.144017 }, images: [] },
  { name_key: 'city.berrechid', region_key: 'region.casablanca_settat', coords: { lat: 33.267675, lng: -7.581147 }, images: [] },
  { name_key: 'city.bouskoura', region_key: 'region.casablanca_settat', coords: { lat: 33.456443, lng: -7.650666 }, images: [] },
  { name_key: 'city.casablanca', region_key: 'region.casablanca_settat', coords: { lat: 33.594514, lng: -7.620028 }, images: [] },
  { name_key: 'city.dar_bouazza', region_key: 'region.casablanca_settat', coords: { lat: 33.521583, lng: -7.816437 }, images: [] },
  { name_key: 'city.el_jadida', region_key: 'region.casablanca_settat', coords: { lat: 33.243331, lng: -8.49884 }, images: [] },
  { name_key: 'city.lahraouyine', region_key: 'region.casablanca_settat', coords: { lat: 33.54083, lng: -7.524186 }, images: [] },
  { name_key: 'city.mohammedia', region_key: 'region.casablanca_settat', coords: { lat: 33.695838, lng: -7.389329 }, images: [] },
  { name_key: 'city.settat', region_key: 'region.casablanca_settat', coords: { lat: 33.002397, lng: -7.619867 }, images: [] },
  { name_key: 'city.sidi_bennour', region_key: 'region.casablanca_settat', coords: { lat: 32.650779, lng: -8.424209 }, images: [] },
  { name_key: 'city.ben_guerir', region_key: 'region.marrakesh_safi', coords: { lat: 32.239034, lng: -7.958131 }, images: [] },
  { name_key: 'city.el_kelaa_des_sraghna', region_key: 'region.marrakesh_safi', coords: { lat: 32.053892, lng: -7.406864 }, images: [] },
  { name_key: 'city.essaouira', region_key: 'region.marrakesh_safi', coords: { lat: 31.511828, lng: -9.76209 }, images: [] },
  { name_key: 'city.marrakesh', region_key: 'region.marrakesh_safi', coords: { lat: 31.625826, lng: -7.989161 }, images: [] },
  { name_key: 'city.safi', region_key: 'region.marrakesh_safi', coords: { lat: 32.299424, lng: -9.239533 }, images: [] },
  { name_key: 'city.youssoufia', region_key: 'region.marrakesh_safi', coords: { lat: 32.245801, lng: -8.532439 }, images: [] },
  { name_key: 'city.errachidia', region_key: 'region.draa_tafilalet', coords: { lat: 31.929089, lng: -4.434081 }, images: [] },
  { name_key: 'city.midelt', region_key: 'region.draa_tafilalet', coords: { lat: 32.680347, lng: -4.739897 }, images: [] },
  { name_key: 'city.ouarzazate', region_key: 'region.draa_tafilalet', coords: { lat: 30.920193, lng: -6.910923 }, images: [] },
  { name_key: 'city.agadir', region_key: 'region.souss_massa', coords: { lat: 30.420516, lng: -9.583853 }, images: [] },
  { name_key: 'city.ait_melloul', region_key: 'region.souss_massa', coords: { lat: 30.338795, lng: -9.50447 }, images: [] },
  { name_key: 'city.dcheira_el_jihadia', region_key: 'region.souss_massa', coords: { lat: 30.375281, lng: -9.528495 }, images: [] },
  { name_key: 'city.drargua', region_key: 'region.souss_massa', coords: { lat: 30.38203, lng: -9.476421 }, images: [] },
  { name_key: 'city.inezgane', region_key: 'region.souss_massa', coords: { lat: 30.356293, lng: -9.545935 }, images: [] },
  { name_key: 'city.lqliaa', region_key: 'region.souss_massa', coords: { lat: 30.29865, lng: -9.462018 }, images: [] },
  { name_key: 'city.oulad_teima', region_key: 'region.souss_massa', coords: { lat: 30.395471, lng: -9.210534 }, images: [] },
  { name_key: 'city.taroudant', region_key: 'region.souss_massa', coords: { lat: 30.470651, lng: -8.877922 }, images: [] },
  { name_key: 'city.tiznit', region_key: 'region.souss_massa', coords: { lat: 29.698624, lng: -9.731281 }, images: [] },
  { name_key: 'city.guelmim', region_key: 'region.guelmim_oued_noun', coords: { lat: 28.986385, lng: -10.057435 }, images: [] },
  { name_key: 'city.tan_tan', region_key: 'region.guelmim_oued_noun', coords: { lat: 28.437553, lng: -11.098664 }, images: [] },
  { name_key: 'city.laayoune', region_key: 'region.laayoune_sakia_el_hamra', coords: { lat: 27.154512, lng: -13.195392 }, images: [] },
  { name_key: 'city.dakhla', region_key: 'region.dakhla_oued_ed_dahab', coords: { lat: 23.694066, lng: -15.943127 }, images: [] },
] as const

type DatasetPlace = {
  id: string
  name: string
  type: string
  city: string
  region: string
  description: string
  rating?: number
  price_range?: string
  opening_hours?: string
  latitude: number
  longitude: number
  categories?: string[]
}

function normalizeText(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, ' ')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function parseEntryFee(value?: string): number {
  if (!value) return 0
  const normalized = value.toLowerCase()
  if (normalized.includes('accès libre') || normalized.includes('gratuit')) return 0

  const numbers = value.match(/\d+(?:[.,]\d+)?/g)
  if (!numbers?.length) return 0

  const parsed = numbers
    .map((part) => Number(part.replace(',', '.')))
    .filter((part) => Number.isFinite(part))

  if (!parsed.length) return 0
  return Math.min(...parsed)
}

function regionKeyFromLabel(regionLabel: string): string | null {
  const label = normalizeText(regionLabel)
  const region = MOROCCO_REGIONS.find((key) => key === `region.${label}`)
  return region ?? null
}

function cityKeyFromLabel(cityLabel: string): string {
  const normalized = normalizeText(cityLabel)
  const aliases: Record<string, string> = {
    fez: 'fes',
    moulay_idriss_zerhoun: 'moulay_idriss',
    moulay_yaacoub: 'moulay_yaacoub',
    moulay_yaacoub_: 'moulay_yaacoub'
  }
  const finalLabel = aliases[normalized] ?? normalized
  return `city.${finalLabel}`
}

function readDatasetPlaces(): DatasetPlace[] {
  const datasetPath = join(process.cwd(), 'prisma', 'dataset.json')
  const raw = readFileSync(datasetPath, 'utf-8')
  return JSON.parse(raw) as DatasetPlace[]
}

async function upsertRoles() {
  await Promise.all(
    ['admin', 'partner', 'user'].map((role) =>
      prisma.role.upsert({
        where: { name: role },
        create: { name: role },
        update: {}
      })
    )
  )

  console.log('roles created')
}

async function upsertUsers() {
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    create: {
      name: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('secret', 12),
      role: { connect: { name: 'admin' } }
    },
    update: {}
  })

  console.log('admin user created')
  console.log('email : admin@example.com')
  console.log('password : secret')
}

async function upsertRegionsAndCities() {
  let createdRegions = 0
  let createdCities = 0

  const regionsByKey = new Map<string, string>()

  for (const regionKey of MOROCCO_REGIONS) {
    const region = await prisma.region.upsert({
      where: { name_key: regionKey },
      create: { name_key: regionKey },
      update: {}
    })

    regionsByKey.set(regionKey, region.id)
    createdRegions += 1
  }

  for (const citySeed of MOROCCO_CITIES) {
    const regionId = regionsByKey.get(citySeed.region_key)
    if (!regionId) continue

    await prisma.city.upsert({
      where: { name_key: citySeed.name_key },
      create: {
        name_key: citySeed.name_key,
        coords: citySeed.coords,
        images: [...citySeed.images],
        region: { connect: { id: regionId } }
      },
      update: {
        coords: citySeed.coords,
        images: [...citySeed.images],
        region: { connect: { id: regionId } }
      }
    })

    createdCities += 1
  }

  console.log(`${createdRegions} regions upserted`)
  console.log(`${createdCities} cities upserted`)
}

async function upsertCategoriesAndPlacesFromDataset() {
  const dataset = readDatasetPlaces()

  const regionByKey = new Map<string, { id: string }>()
  const cityByKey = new Map<string, { id: string }>()

  const regions = await prisma.region.findMany({
    select: { id: true, name_key: true }
  })
  regions.forEach((region) => regionByKey.set(region.name_key, { id: region.id }))

  const cities = await prisma.city.findMany({
    select: { id: true, name_key: true }
  })
  cities.forEach((city) => cityByKey.set(city.name_key, { id: city.id }))

  const categoryIdsByType = new Map<string, string>()
  for (const type of new Set(dataset.map((item) => item.type.trim()).filter(Boolean))) {
    const typeKey = normalizeText(type)
    const category = await prisma.category.upsert({
      where: { name_key: `category.${typeKey}.name` },
      create: {
        name_key: `category.${typeKey}.name`,
        description_key: `category.${typeKey}.description`
      },
      update: {}
    })
    categoryIdsByType.set(type, category.id)
  }

  let createdCities = 0
  for (const item of dataset) {
    const key = cityKeyFromLabel(item.city)
    if (cityByKey.has(key)) continue

    const regionKey = regionKeyFromLabel(item.region)
    if (!regionKey) continue
    const region = regionByKey.get(regionKey)
    if (!region) continue

    const city = await prisma.city.upsert({
      where: { name_key: key },
      create: {
        name_key: key,
        coords: { lat: item.latitude, lng: item.longitude },
        images: [],
        region: { connect: { id: region.id } }
      },
      update: {
        region: { connect: { id: region.id } }
      }
    })

    cityByKey.set(key, { id: city.id })
    createdCities += 1
  }

  let seededPlaces = 0
  for (const item of dataset) {
    const cityKey = cityKeyFromLabel(item.city)
    const city = cityByKey.get(cityKey)
    if (!city) continue

    const categoryId = categoryIdsByType.get(item.type)
    if (!categoryId) continue

    const tags = [item.type, ...(item.categories ?? [])]
      .map((tag) => normalizeText(tag))
      .filter(Boolean)

    await prisma.place.upsert({
      where: { name_key: `place.${item.id}.name` },
      create: {
        name_key: `place.${item.id}.name`,
        description_key: `place.${item.id}.description`,
        coords: { lat: item.latitude, lng: item.longitude },
        images: [],
        video: '',
        tags,
        entryFee: parseEntryFee(item.price_range),
        openingHours: item.opening_hours ?? 'N/A',
        city: { connect: { id: city.id } },
        category: { connect: { id: categoryId } }
      },
      update: {
        coords: { lat: item.latitude, lng: item.longitude },
        tags,
        entryFee: parseEntryFee(item.price_range),
        openingHours: item.opening_hours ?? 'N/A',
        city: { connect: { id: city.id } },
        category: { connect: { id: categoryId } }
      }
    })

    seededPlaces += 1
  }

  console.log(`${createdCities} dataset cities upserted`)
  console.log(`${categoryIdsByType.size} categories upserted from dataset types`)
  console.log(`${seededPlaces} places upserted from dataset`)
}

async function main() {
  await upsertRoles()
  await upsertUsers()
  await upsertRegionsAndCities()
  await upsertCategoriesAndPlacesFromDataset()

  console.log('Seeding completed')

  process.exit(0)
}
main()
