# 🚀 NASA-APP

Aplicación móvil y web desarrollada con **React Native + Expo**, que consume múltiples APIs públicas de la **NASA**. Construida con arquitectura **CLEAN + MVVM**, principios **SOLID** y uso de patrones como **Repository**, **UseCase** y **Factory**.

---

## Funcionalidades principales

- 🔭 **APOD (Astronomy Picture of the Day)** con animaciones y modo offline
- 🌍 **EPIC**: imágenes satelitales de la Tierra
- 📚 **NASA Image & Video Library** con buscador interactivo
- ☄️ **Asteroides Cercanos (NEO)** con filtros por fecha
- 💻 **TechTransfer**: software NASA disponible públicamente
- 📝 **Registro de usuarios** con validación y almacenamiento local

---

## ⚙️ Tecnologías utilizadas

- **Expo + React Native**
- **TypeScript**
- **Redux Toolkit** (estado global)
- **React Navigation** (stack, tabs, modals)
- **React Hook Form + Yup** (validación)
- **Reanimated v3** (animaciones avanzadas)
- **AsyncStorage** (modo offline)
- **Axios** (consumo de APIs NASA)
- Arquitectura **CLEAN + MVVM**
- Principios **SOLID, DRY, KISS, YAGNI**

---

## 📁 Estructura del proyecto
NASA-APP/
├── assets/
├── src/
│ ├── presentation/
│ │ ├── screens/
│ │ └── viewmodels/
│ ├── data/
│ │ └── repositories/
│ ├── domain/
│ │ ├── models/
│ │ └── usecases/
│ ├── service/
│ └── navigation/
├── store/
├── .env
├── App.tsx
├── README.md
## 📦 Instalación
npm install
npx expo start
## 🧠 Arquitectura y buenas prácticas
Separación por capas: data, domain, presentation, ui

Repositorios desacoplados de la API

Casos de uso como orquestadores de lógica de negocio

Tipado estricto con modelos de dominio

Animaciones declarativas con Reanimated

Integración de modo offline con AsyncStorage
