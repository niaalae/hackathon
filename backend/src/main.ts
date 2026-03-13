import 'dotenv/config'  // ← MUST be first

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { existsSync } from 'fs'
import { join } from 'path'

type ExpressLike = {
  get: (path: RegExp, handler: (req: unknown, res: { sendFile: (path: string) => void }) => void) => void
}

const resolveFrontendDist = () => {
  const candidates = [
    join(process.cwd(), 'frontend', 'dist'),
    join(process.cwd(), '..', 'frontend', 'dist'),
    join(__dirname, '..', '..', 'frontend', 'dist'),
    join(__dirname, '..', 'frontend', 'dist')
  ]

  for (const candidate of candidates) {
    if (existsSync(join(candidate, 'index.html'))) {
      return candidate
    }
  }

  return null
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.use(cookieParser())

  app.enableCors({
    origin: true,
    credentials: true
  })
  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true
    })
  )

  const frontendDist = resolveFrontendDist()
  if (frontendDist) {
    app.useStaticAssets(frontendDist)

    const instance = app.getHttpAdapter().getInstance() as ExpressLike
    instance.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(join(frontendDist, 'index.html'))
    })
  }

  const port = Number(process.env.PORT ?? 4001)
  await app.listen(port)
}

bootstrap()
