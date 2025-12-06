# 🚀 DevOps Academy - GitHub Actions Tutorial

Una aplicación interactiva y moderna para aprender GitHub Actions desde cero, con integración de Machine Learning Operations (MLOps).

## ✨ Características

### 🎯 Aprendizaje Interactivo
- **Lecciones estructuradas** sobre GitHub Actions y MLOps
- **Sistema de quizzes avanzado** con diferentes tipos de preguntas
- **Sistema de puntos y XP** para gamificar el aprendizaje
- **Centro de investigación** con búsqueda inteligente usando Gemini AI

### 🎨 Interfaz Moderna
- **Modo oscuro/claro** con transiciones suaves
- **Diseño responsivo** optimizado para móvil y desktop
- **Animaciones fluidas** y microinteracciones
- **Componentes visuales atractivos** con gradientes y sombras

### 🐳 Despliegue Simplificado
- **Contenedor Docker** listo para producción
- **Configuración nginx optimizada** con compresión gzip
- **Docker Compose** para despliegue fácil
- **Build multi-stage** para imágenes ligeras

## 🛠️ Tecnologías

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS con diseño personalizado
- **AI**: Google Gemini 2.5 Flash para contenido dinámico
- **Icons**: Lucide React
- **Markdown**: React Markdown para renderizado de contenido
- **Container**: Docker + Nginx para producción

## 🚀 Inicio Rápido

### Opción 1: Docker (Recomendado)

```bash
# Clonar el repositorio
git clone <repository-url>
cd GitHubActions

# Construir y ejecutar con Docker Compose
docker-compose up --build
```

La aplicación estará disponible en `http://localhost:3000`

### Opción 2: Desarrollo Local

```bash
# Instalar dependencias
cd devops-&-ml-academy
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu API key de Google Gemini

# Ejecutar en modo desarrollo
npm run dev
```

## 📁 Estructura del Proyecto

```
├── devops-&-ml-academy/          # Aplicación principal React
│   ├── components/               # Componentes reutilizables
│   ├── services/                 # Servicios (Gemini AI)
│   ├── constants.ts              # Datos del currículo
│   ├── types.ts                  # Definiciones TypeScript
│   └── ...
├── Notas/                        # Contenido educativo adicional
├── Dockerfile                    # Configuración Docker
├── docker-compose.yml           # Orquestación de contenedores
├── nginx.conf                   # Configuración del servidor web
└── README.md                    # Esta documentación
```

## 🎓 Contenido del Curso

### Capítulo 2: GitHub Actions
- YAML Intermedio
- Flujos de trabajo de CI/CD
- Variables de entorno y secretos
- Integración con Python

### Capítulo 3: CI en Machine Learning
- Entrenamiento de modelos con GitHub Actions
- CML (Continuous Machine Learning)
- DVC (Data Version Control)
- Pipelines de ML

### Capítulo 4: Optimización y Comparación
- Métricas y visualizaciones con DVC
- Comparación de experimentos
- Optimización de hiperparámetros
- Automatización de PRs

## 🔧 Configuración

### Variables de Entorno

Crear un archivo `.env` en la carpeta `devops-&-ml-academy/`:

```env
API_KEY=tu_api_key_de_google_gemini
```

### API Key de Google Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Crea una nueva API key
3. Copia la key en tu archivo `.env`

## 🏗️ Despliegue en Producción

### Con Docker

```bash
# Construir la imagen
docker build -t devops-academy .

# Ejecutar el contenedor
docker run -p 3000:80 devops-academy
```

### Con Docker Compose

```bash
docker-compose up -d
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **Google Gemini** por la generación de contenido inteligente
- **Tailwind CSS** por el sistema de diseño utilitario
- **React** por el framework frontend
- **Docker** por la containerización

---

**¡Feliz aprendizaje! 🎓** Comienza tu viaje en DevOps y MLOps con esta academia interactiva.
