-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegionTranslation" (
    "id" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RegionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CityTranslation" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CityTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryTranslation" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "CategoryTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaceTranslation" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "PlaceTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_language_key" ON "Language"("language");

-- CreateIndex
CREATE UNIQUE INDEX "RegionTranslation_regionId_languageId_key" ON "RegionTranslation"("regionId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "CityTranslation_cityId_languageId_key" ON "CityTranslation"("cityId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryTranslation_categoryId_languageId_key" ON "CategoryTranslation"("categoryId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaceTranslation_placeId_languageId_key" ON "PlaceTranslation"("placeId", "languageId");

-- AddForeignKey
ALTER TABLE "RegionTranslation" ADD CONSTRAINT "RegionTranslation_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionTranslation" ADD CONSTRAINT "RegionTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CityTranslation" ADD CONSTRAINT "CityTranslation_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CityTranslation" ADD CONSTRAINT "CityTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceTranslation" ADD CONSTRAINT "PlaceTranslation_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceTranslation" ADD CONSTRAINT "PlaceTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
