# ♻️ Smart Garbage Collection System

A full-stack intelligent waste management system designed to optimize garbage collection using **AI-based waste classification**, **route-based collection**, and **role-based dashboards**.

---

## 🚀 Overview

This project aims to modernize traditional garbage collection systems by introducing:

- 📸 Image-based waste classification (CNN / YOLOv8)
- 🧠 ML microservice for intelligent predictions
- 🧑‍💻 Role-based dashboards (User, Collector, Municipality)
- 📍 Location-based pickup scheduling
- 🚛 Route-based waste collection for efficiency

---

## 🏗️ System Architecture

![Architecture](./Architecture.png)

---

## 🧩 Architecture Explanation

The system is divided into **four main layers**:

---

### 🟦 Frontend Layer (React / Next.js)

Provides role-based dashboards:

#### 👤 User Dashboard
- Upload garbage images
- Schedule pickup (next 2 days)
- Select waste types (Blue, Green, Black)
- Location-based address selection

#### 🚛 Collector Dashboard
- View assigned routes
- Update status (Arrived / Completed)
- Trigger user notifications

#### 🏙️ Municipality Dashboard
- View analytics of waste collected
- Monitor daily waste distribution

---

### 🟩 Backend Layer (Node.js / Express)

Handles core application logic:

- 🔐 Authentication (User / Collector / Municipality)
- 🔀 Role-based routing
- 📡 API handling
- ⚙️ Business logic
- 🔗 Communication with ML microservice

---

### 🟧 ML Microservice (FastAPI)

Dedicated service for AI-based predictions:

1. Fetch image from Cloudinary URL  
2. Perform image quality check (Blur Detection)  
3. Run model inference (CNN / YOLOv8)  
4. Return prediction + confidence score  

---

### 🟪 Database Layer (MongoDB)

Stores all critical system data:

- User information  
- Pickup schedules  
- Prediction results  
- Collector routes  

---

### ☁️ External Service (Cloudinary)

- Stores uploaded images  
- Provides secure image URLs  
- Used by ML service for fetching images  

---

## 🔄 Data Flow

1. User uploads image → stored on Cloudinary  
2. Frontend sends request → Backend  
3. Backend sends image URL → ML Microservice  
4. ML Service processes image → returns prediction  
5. Backend stores results → MongoDB  
6. Collector receives optimized route  
7. Notifications sent to user during pickup  

---

## 🧠 Key Features

- ✅ AI-based waste classification  
- ✅ Blur detection for image validation  
- ✅ Role-based system (User / Collector / Municipality)  
- ✅ Route-based garbage collection  
- ✅ Real-time notifications  
- ✅ Scalable microservice architecture  

---

## 🛠️ Tech Stack

### Frontend
- React / Next.js  
- Tailwind CSS  

### Backend
- Node.js  
- Express.js  

### ML Microservice
- FastAPI  
- OpenCV (blur detection)  
- CNN / YOLOv8  

### Database
- MongoDB  

### Cloud
- Cloudinary (image storage)

---

## 🤖 Tools & AI Assistance Used

This project was accelerated using modern AI tools:

- **ChatGPT** → Used for system design, prompt engineering, and architecture planning  
- **Loveable** → Used to generate frontend UI components and dashboards  
- **DeepSeek** → Assisted in backend logic and API structuring  

---
