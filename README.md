# ✨ Llaio - Premium AI Grammar Correction

![Llaio App Preview](https://img.shields.io/badge/Status-Live_on_Vercel-success?style=for-the-badge&logo=vercel)
![Backend](https://img.shields.io/badge/Backend-Live_on_Render-blue?style=for-the-badge&logo=render)

Llaio is a blazing fast, beautifully designed AI SaaS application that instantly corrects your grammar and provides detailed, educational explanations for the changes it makes. Built with an uncompromising focus on a premium, fluid user interface and powered by the speed of Llama 3.3.

### 🔗 Live Links
* **Frontend Application**: [https://llaio-seven.vercel.app/](https://llaio-seven.vercel.app/)
* **Backend API**: [https://llaio.onrender.com/docs](https://llaio.onrender.com/docs) (Swagger UI)

---

## 🛠 Tech Stack
This project is structured as a fullstack monorepo featuring a cutting-edge stack:

**Frontend (`/llaio-app`)**
* **Next.js**: The modern React framework optimized with Turbopack.
* **Tailwind CSS v4**: For beautiful, utility-first CSS styling and glassmorphism.
* **Lucide React**: Clean and elegant iconography.
* **Features**: Seamless dark/light theme switching with smooth radial expansion animations, parallax background effects, and a highly polished UI.

**Backend (`/backend`)**
* **FastAPI**: A modern, extremely fast Python web framework.
* **Groq**: Running the massive `llama-3.3-70b-versatile` model for near-instant inference.
* **Pydantic**: For strict, reliable data validation.

---

## 🚀 How to Run Locally

If you want to clone this repository and run it on your own machine, follow these steps:

### 1. Start the Python Backend
Open a terminal and navigate to the backend folder:
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```
*Create a `.env` file in the `backend/` folder and add your Groq API key: `GROQ_API_KEY=your_key_here`*

Start the backend server:
```bash
uvicorn main:app --reload
```

### 2. Start the Next.js Frontend
Open a **second** terminal window and navigate to the frontend folder:
```bash
cd llaio-app
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application running!

---

*Powered by Llama 3.3 · FastAPI + Next.js*
