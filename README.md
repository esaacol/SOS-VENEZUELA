# SOS Venezuela

Plataforma de coordinacion de ayuda humanitaria para reportar emergencias, registrar centros de acopio, ofrecer recursos y conectar solicitudes con recursos disponibles.

## Modulos

- Inicio / mapa operativo con estadisticas.
- Reportes de emergencia.
- Centros de acopio, refugios y puntos de ayuda.
- Recursos disponibles: transporte, maquinaria, comida, agua, medicinas, voluntarios.
- Solicitudes de ayuda.
- Panel admin protegido con `ADMIN_SECRET`.
- Asignaciones entre solicitudes y recursos compatibles.

## Variables de entorno

Copia `.env.example` a `.env`:

```env
DATABASE_URL="postgresql://sos_user:TU_PASSWORD@localhost:5432/sos_venezuela?schema=public"
ADMIN_SECRET="cambia-este-secreto-largo"
NEXT_PUBLIC_APP_URL="https://sos.tu-dominio.com"
PORT="3010"
NODE_ENV="production"
```

## Desarrollo local

```bash
npm install
npx prisma migrate dev --name add_coordination_modules
npx prisma generate
npm run dev
```

Abre `http://localhost:3010`.

## Produccion en la misma VPS de RUTERO

RUTERO puede quedar detenido sin borrar nada:

```bash
pm2 stop rutero
pm2 save
```

Crear base de datos separada:

```bash
sudo -u postgres createdb sos_venezuela
sudo -u postgres createuser sos_user
sudo -u postgres psql -c "ALTER USER sos_user WITH PASSWORD 'TU_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE sos_venezuela TO sos_user;"
```

Instalar y levantar:

```bash
cd /var/www/sos-venezuela
npm install
npx prisma migrate deploy
npx prisma generate
npm run build
pm2 start npm --name sos-venezuela -- start -- -p 3010
pm2 save
```

## Nginx

Ejemplo:

```nginx
server {
  server_name sos.tu-dominio.com;

  location / {
    proxy_pass http://127.0.0.1:3010;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

## Seguridad

- No expongas `ADMIN_SECRET`.
- Las APIs admin validan `x-admin-secret`.
- Las vistas publicas no muestran telefonos completos ni nombres privados innecesarios.
- Haz backup antes de produccion:

```bash
pg_dump sos_venezuela > sos_venezuela_backup.sql
```

## Primeras pruebas recomendadas

1. Crear una solicitud de ayuda.
2. Crear un recurso disponible compatible.
3. Entrar al panel admin con `ADMIN_SECRET`.
4. Verificar ambos registros.
5. Asignar el recurso a la solicitud.
