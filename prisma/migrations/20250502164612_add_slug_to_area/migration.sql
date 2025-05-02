-- 1. Añade la columna slug como nullable
ALTER TABLE "areas" ADD COLUMN "slug" TEXT;

-- 2. Rellena slug para las filas existentes.  
--    Ajusta la lógica según tus necesidades de slug (este ejemplo toma el nombre en minúsculas y reemplaza espacios por guiones).
UPDATE "areas"
SET slug = lower(regexp_replace(nombre, '\s+', '-', 'g'));

-- 3. Marca slug como NOT NULL
ALTER TABLE "areas"
ALTER COLUMN slug SET NOT NULL;

-- 4. (Opcional) Añade índice único si en tu schema lo tienes
CREATE UNIQUE INDEX "Area_slug_key" ON "areas" (slug);
