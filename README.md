# DriveMate - Driving School Management System

Hệ thống quản lý trường lái xe hiện đại được xây dựng với Next.js 15, TypeScript và Redux Toolkit.

## 🏗️ Kiến trúc

Dự án sử dụng **Feature-Based Architecture** - mỗi tính năng là một module độc lập với components, logic và state riêng.

## 🛠️ Công nghệ sử dụng

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **State Management:** Redux Toolkit
- **Form:** React Hook Form + Yup validation
- **Icons:** Lucide React
- **Charts:** Recharts

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm/yarn/pnpm

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd webapp

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Environment Variables**
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_APP_NAME=DriveMate
```

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📁 Cấu trúc dự án

```
src/
├── app/                    # Next.js App Router
├── components/             # UI Components
├── features/              # Feature modules
├── hooks/                 # Custom hooks
├── lib/                   # Utilities
├── store/                 # Redux store
└── types/                 # TypeScript types
```

## 🔧 Phát triển

### Thêm tính năng mới
1. Tạo thư mục trong `src/features/`
2. Thêm components, hooks, state
3. Kết nối với Redux store
4. Viết tests

## 🚀 Triển khai

```bash
npm run build    # Build production
npm run start    # Start production server
```

## 📄 License

This project is licensed under the MIT License.

---

**DriveMate** - Modern Driving School Management System

*Built with ❤️ using Feature-Based Architecture with Next.js, TypeScript, and Redux Toolkit*
