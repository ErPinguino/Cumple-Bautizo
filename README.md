# 🎀 Babyshower de Aurora

Aplicación web para gestionar la lista de regalos del cumpleaños de Aurora. Los invitados pueden entrar con su nombre, ver la lista de regalos disponibles y reservar el que quieran. Los regalos ya reservados aparecen bloqueados para evitar duplicados.

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 16.1.6 | Framework fullstack (App Router) |
| React | 19.2.3 | UI |
| TypeScript | ^5 | Tipado estático |
| Prisma | ^7.4.0 | ORM para la base de datos |
| better-sqlite3 | vía adapter | Base de datos SQLite local |
| Framer Motion | ^12.38.0 | Animaciones entre pantallas y modales |
| canvas-confetti | ^1.9.4 | Efecto de confeti en la pantalla de gracias |
| dotenv | ^17.2.3 | Variables de entorno |

---

## 📁 Estructura del proyecto

```
babyshower/
├── prisma/
│   ├── schema.prisma        # Modelos de la base de datos
│   ├── seed.ts              # Script para poblar la base de datos
│   └── migrations/          # Migraciones de Prisma
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── regalo/
│   │   │   │   └── route.ts     # GET /api/regalo
│   │   │   └── invitados/
│   │   │       └── route.ts     # GET y POST /api/invitados
│   │   ├── layout.tsx           # Layout raíz de Next.js
│   │   ├── page.tsx             # Página principal (componente BabyshowerAurora)
│   │   └── globals.css          # Estilos globales
│   ├── lib/
│   │   └── prisma.ts            # Instancia singleton de PrismaClient
│   └── types/
│       └── index.ts             # Tipos TypeScript (Regalo)
├── public/
│   ├── plimplim_1.png           # Personaje pantalla 1
│   ├── plimplim.png             # Personaje pantalla 2
│   ├── plimplim_deco.png        # Personaje esquina decorativo
│   └── plim_plim_ty.jpg         # Imagen pantalla de gracias
├── prisma.config.ts             # Configuración de Prisma 7
├── package.json
└── .env                         # Variables de entorno (no subir a git)
```

---

## 🗄️ Base de datos

La base de datos es un archivo SQLite local (`dev.db`) gestionado con Prisma y el adaptador `better-sqlite3`.

### Modelos

#### `Regalo`
| Campo | Tipo | Descripción |
|---|---|---|
| id | Int (PK) | Identificador autoincremental |
| nombre | String | Nombre del regalo |
| descripcion | String? | Descripción opcional |
| precio | String? | Rango de precio opcional |
| invitados | Invitado[] | Relación con invitados |

#### `Invitado`
| Campo | Tipo | Descripción |
|---|---|---|
| id | Int (PK) | Identificador autoincremental |
| nombre | String | Nombre del invitado |
| regaloId | Int (FK) | Referencia al regalo elegido |
| createdAt | DateTime | Fecha de reserva |

---

## 🔌 API

### `GET /api/regalo`
Devuelve todos los regalos ordenados alfabéticamente.

**Respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Alfombra habitación",
    "descripcion": "Mediana-grande",
    "precio": "30-50€"
  }
]
```

---

### `GET /api/invitados`
Devuelve los `regaloId` de todos los invitados que ya han reservado. Se usa en el front para marcar los regalos como bloqueados.

**Respuesta:**
```json
[
  { "regaloId": 3 },
  { "regaloId": 7 }
]
```

---

### `POST /api/invitados`
Reserva un regalo para un invitado. Antes de crear el registro verifica que el regalo sigue libre para evitar duplicados en caso de concurrencia.

**Body:**
```json
{
  "nombre": "María",
  "regaloId": 5
}
```

**Respuesta exitosa:**
```json
{ "success": true }
```

**Respuesta si el regalo ya está reservado:**
```json
{
  "success": false,
  "error": "¡Vaya! Alguien acaba de reservar este regalo hace un momento."
}
```

---

## 🖥️ Flujo de la aplicación

La app tiene tres pantallas que se transicionan con animaciones de Framer Motion:

**Pantalla 1 — Bienvenida**
El invitado escribe su nombre. El botón "Entrar" tiene una animación de pulso continuo. También funciona pulsando Enter.

**Pantalla 2 — Lista de regalos**
Se cargan los regalos y los ya reservados en paralelo. Mientras cargan se muestra un skeleton animado. Los regalos disponibles se pueden seleccionar con radio buttons. Los ya reservados aparecen en gris con un candado 🔒. Un contador muestra cuántos regalos quedan disponibles. Al pulsar "Elegir y Enviar" se hace la reserva en el backend.

**Pantalla 3 — Gracias**
Confirma la elección del invitado y lanza un efecto de confeti de colores.

Los errores de validación (nombre vacío, regalo no seleccionado, regalo ya cogido) se muestran en un modal animado en lugar de alertas nativas del navegador.

---

## ⚙️ Instalación y puesta en marcha

### 1. Clonar e instalar dependencias

```bash
git clone <url-del-repositorio>
cd babyshower
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="file:./dev.db"
```

### 3. Generar el cliente de Prisma

```bash
npx prisma generate
```

### 4. Crear las tablas en la base de datos

```bash
npx prisma db push
```

### 5. Poblar la base de datos con los regalos

```bash
npx prisma db seed
```

### 6. Arrancar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## 📜 Scripts disponibles

| Script | Comando | Descripción |
|---|---|---|
| Desarrollo | `npm run dev` | Arranca el servidor de desarrollo |
| Build | `npm run build` | Compila la app para producción |
| Producción | `npm run start` | Arranca el servidor en modo producción |
| Generar cliente | `npm run db:generate` | Regenera el cliente de Prisma |
| Sincronizar DB | `npm run db:push` | Aplica el schema a la base de datos |
| Migrar | `npm run db:migrate` | Crea una migración con nombre |
| Seed | `npm run db:seed` | Carga los regalos iniciales |

---

## 📝 Notas técnicas

**¿Por qué `@prisma/client` en lugar de la ruta generada personalizada?**
El proyecto usa Prisma 7 con el adaptador `better-sqlite3`. Durante el desarrollo se detectó que importar desde una ruta de output personalizada (`src/generated/prisma/client`) causaba que el seed cargara un cliente desactualizado. La solución fue importar siempre desde `@prisma/client`, que es donde Prisma genera el cliente por defecto y mantiene sincronizado.

**¿Por qué SQLite?**
Al ser una app de uso puntual (un único evento) no se necesita un servidor de base de datos. SQLite es suficiente, sencillo de configurar y no requiere infraestructura adicional.

**Prevención de reservas duplicadas**
El endpoint `POST /api/invitados` hace una verificación previa antes de crear el registro, comprobando si el `regaloId` ya tiene un invitado asignado. Esto evita que dos personas que entren al mismo tiempo puedan reservar el mismo regalo.