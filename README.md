# decode9 - Portfolio Personal

Sitio web personal de Jorge Bastidas (decode9), desarrollador Full Stack con más de 10 años de experiencia.

## 🚀 Tecnologías

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Animaciones:** Framer Motion
- **Syntax Highlighting:** React Syntax Highlighter
- **Íconos:** React Icons

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── globals.css         # Estilos globales
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página principal
├── components/             # Componentes React
│   ├── Layout/             # Componentes de layout
│   │   ├── Header/
│   │   └── Footer/
│   └── Sections/           # Secciones de la página
│       ├── Hero/
│       ├── About/
│       ├── TechStack/
│       ├── Projects/
│       ├── Architecture/
│       ├── CodeProblems/
│       └── Contact/
├── data/                   # Datos estáticos
│   ├── technologies.ts
│   ├── projects.ts
│   ├── architecture.ts
│   └── codeProblems.ts
├── hooks/                  # Custom hooks
│   ├── useScrollAnimation.ts
│   ├── useTypingEffect.ts
│   └── useActiveSection.ts
├── interfaces/             # TypeScript interfaces
│   └── index.ts
└── utils/                  # Utilidades
    ├── cn.ts
    └── index.ts
```

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/decode9/portfolio.git
cd portfolio
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Genera la build de producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 🎨 Características

- ✅ Diseño moderno y minimalista
- ✅ Totalmente responsive
- ✅ Animaciones suaves con Framer Motion
- ✅ Syntax highlighting para código
- ✅ Sección de tecnologías con filtros
- ✅ Galería de proyectos
- ✅ Ejemplos de arquitectura de software
- ✅ Problemas de código con soluciones
- ✅ Formulario de contacto
- ✅ SEO optimizado

## 🏗️ Arquitectura de Componentes

Cada componente sigue una estructura modular:

```
ComponentName/
├── index.tsx       # Componente principal
├── styles.module.css  # Estilos (opcional)
├── interfaces.ts   # Tipos (opcional)
└── hooks.ts        # Lógica (opcional)
```

## 📄 Licencia

MIT © Jorge Bastidas (decode9)

## 📬 Contacto

- **GitHub:** [@decode9](https://github.com/decode9)
- **LinkedIn:** [/in/decode9](https://linkedin.com/in/decode9)
- **Email:** jbastidas@theempire.tech

