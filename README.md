# DriveMate - Driving School Management System

A modern, scalable web application built with Next.js 15, TypeScript, and Redux Toolkit for driving school management.

## 🏗️ Architecture Overview

This project follows **Feature-Based Architecture**, where each feature is a complete, self-contained module with its own components, logic, and state management.

### 📊 Simple Architecture Diagram

```mermaid
graph TB
    subgraph "🚀 Application"
        subgraph "📱 Features"
            Auth[🔐 Authentication]
            Dashboard[📊 Dashboard]
            Profile[👤 User Profile]
            Reports[📈 Reports]
        end
        
        subgraph "🔧 Shared Resources"
            UI[🎨 UI Components]
            Utils[🛠️ Utilities]
            API[🌐 API Client]
        end
        
        subgraph "⚙️ Core Framework"
            NextJS[⚡ Next.js]
            Redux[📦 Redux Toolkit]
            TypeScript[📝 TypeScript]
        end
    end
    
    Auth --> UI
    Dashboard --> UI
    Profile --> UI
    Reports --> UI
    
    Auth --> Utils
    Dashboard --> Utils
    Profile --> Utils
    Reports --> Utils
    
    Auth --> API
    Dashboard --> API
    Profile --> API
    Reports --> API
    
    NextJS --> Auth
    NextJS --> Dashboard
    NextJS --> Profile
    NextJS --> Reports
```

### 🎯 How Features Work

```mermaid
graph LR
    subgraph "🔐 Authentication Feature"
        Login[Login Form]
        Register[Register Form]
        AuthHook[useAuth Hook]
        AuthState[Auth State]
    end
    
    subgraph "📊 Dashboard Feature"
        Charts[Charts]
        Tables[Data Tables]
        DashboardHook[useDashboard Hook]
        DashboardState[Dashboard State]
    end
    
    Login --> AuthHook
    Register --> AuthHook
    AuthHook --> AuthState
    
    Charts --> DashboardHook
    Tables --> DashboardHook
    DashboardHook --> DashboardState
```

## 🔄 Data Flow

### **Simple Request Flow**

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant F as 📱 Feature
    participant H as 🪝 Hook
    participant S as 📦 State
    participant A as 🌐 API

    U->>F: Click Button
    F->>H: Call Hook
    H->>S: Update State
    S->>A: API Request
    A-->>S: Response
    S-->>H: New State
    H-->>F: Re-render
    F-->>U: Show Result
```

### **Feature Communication**

```mermaid
sequenceDiagram
    participant Auth as 🔐 Auth
    participant Dashboard as 📊 Dashboard
    participant Profile as 👤 Profile
    participant Shared as 🔄 Shared State

    Auth->>Shared: User Login
    Shared->>Dashboard: Show User Data
    Dashboard->>Profile: Navigate to Profile
    Profile->>Shared: Update Profile
    Shared->>Dashboard: Refresh Dashboard
```

## 🎯 Feature Structure

### **Each Feature Contains:**

```mermaid
graph TB
    subgraph "📁 Feature Folder"
        Components[🎨 Components]
        Hooks[🪝 Custom Hooks]
        State[📦 Redux State]
        API[🌐 API Calls]
        Types[📝 TypeScript Types]
    end
    
    Components --> Hooks
    Hooks --> State
    State --> API
    API --> Types
```

### **Example: Authentication Feature**

```
src/features/auth/
├── components/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── ForgotPassword.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useSignIn.ts
│   └── useSignUp.ts
├── state/
│   ├── authSlice.ts
│   └── authThunk.ts
├── api/
│   └── authApi.ts
└── types/
    └── auth.types.ts
```

## 🛠️ Technology Stack

### **Core Technologies**

```mermaid
graph LR
    NextJS[⚡ Next.js 15] --> React[⚛️ React 19]
    React --> TypeScript[📝 TypeScript]
    TypeScript --> Tailwind[🎨 Tailwind CSS]
```

### **State Management**

```mermaid
graph LR
    Redux[📦 Redux Toolkit] --> RTK[🔄 RTK Query]
    RTK --> RHF[📝 React Hook Form]
    RHF --> Yup[✅ Yup Validation]
```

### **UI Components**

```mermaid
graph LR
    Tailwind[🎨 Tailwind CSS] --> Shadcn[🎯 shadcn/ui]
    Shadcn --> Lucide[🎨 Lucide Icons]
    Lucide --> Recharts[📊 Recharts]
```

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

## 🔧 Development Guidelines

### **Adding a New Feature**

```mermaid
graph TD
    A[📁 Create Feature Folder] --> B[🎨 Add Components]
    B --> C[🪝 Create Hooks]
    C --> D[📦 Add State]
    D --> E[🌐 Create API]
    E --> F[📝 Add Types]
    F --> G[✅ Test Feature]
```

### **Feature Development Steps**

1. **📁 Create Feature Folder**
   ```bash
   src/features/new-feature/
   ```

2. **🎨 Add Components**
   ```typescript
   // src/features/new-feature/components/
   export function NewFeatureComponent() {
     const { data, loading } = useNewFeature();
     return <div>...</div>;
   }
   ```

3. **🪝 Create Hooks**
   ```typescript
   // src/features/new-feature/hooks/
   export const useNewFeature = () => {
     const dispatch = useAppDispatch();
     // Feature logic here
   };
   ```

4. **📦 Add State**
   ```typescript
   // src/features/new-feature/state/
   const newFeatureSlice = createSlice({
     name: 'newFeature',
     initialState,
     reducers: { /* ... */ }
   });
   ```

## 🧪 Testing Strategy

### **Testing Pyramid**

```mermaid
graph TB
    subgraph "🧪 Testing Strategy"
        E2E[🔍 E2E Tests]
        Integration[🔗 Integration Tests]
        Unit[⚡ Unit Tests]
    end
    
    E2E --> Integration
    Integration --> Unit
```

### **Test Coverage by Feature**

```mermaid
pie title Test Coverage
    "Authentication" : 25
    "Dashboard" : 30
    "Profile" : 20
    "Reports" : 15
    "Shared" : 10
```

## 📈 Performance Optimization

### **Feature-Based Code Splitting**

```mermaid
graph TB
    subgraph "📦 Code Bundles"
        AuthBundle[🔐 Auth Bundle]
        DashboardBundle[📊 Dashboard Bundle]
        ProfileBundle[👤 Profile Bundle]
        ReportsBundle[📈 Reports Bundle]
    end
    
    subgraph "⚡ Loading Strategy"
        LazyAuth[Lazy Load Auth]
        LazyDashboard[Lazy Load Dashboard]
        LazyProfile[Lazy Load Profile]
        LazyReports[Lazy Load Reports]
    end
    
    AuthBundle --> LazyAuth
    DashboardBundle --> LazyDashboard
    ProfileBundle --> LazyProfile
    ReportsBundle --> LazyReports
```

## 🔒 Security

### **Security Layers**

```mermaid
graph TB
    subgraph "🔒 Security"
        Auth[JWT Authentication]
        Validation[Input Validation]
        XSS[XSS Prevention]
        CSRF[CSRF Protection]
    end
    
    subgraph "🛡️ Protection"
        Encrypt[Data Encryption]
        Sanitize[Input Sanitization]
        Validate[Schema Validation]
    end
    
    Auth --> Encrypt
    Validation --> Sanitize
    XSS --> Validate
    CSRF --> Validate
```

## 🚀 Deployment

### **Deployment Pipeline**

```mermaid
graph LR
    Code[💻 Code] --> Build[🔨 Build]
    Build --> Test[✅ Test]
    Test --> Deploy[🚀 Deploy]
    Deploy --> Monitor[📊 Monitor]
```

### **Environment Configuration**

```mermaid
graph TB
    subgraph "🌍 Environments"
        Dev[🛠️ Development]
        Staging[🧪 Staging]
        Production[🚀 Production]
    end
    
    subgraph "⚙️ Configuration"
        AuthConfig[🔐 Auth Config]
        DashboardConfig[📊 Dashboard Config]
        ProfileConfig[👤 Profile Config]
        ReportsConfig[📈 Reports Config]
    end
    
    Dev --> AuthConfig
    Staging --> DashboardConfig
    Production --> ProfileConfig
    Production --> ReportsConfig
```

## 📝 Contributing

### **Development Workflow**

```mermaid
graph LR
    Feature[🌿 Feature Branch] --> Develop[💻 Develop]
    Develop --> Test[✅ Test]
    Test --> Review[👀 Review]
    Review --> Merge[🔀 Merge]
    Merge --> Deploy[🚀 Deploy]
```

### **Quality Gates**

```mermaid
graph TB
    subgraph "✅ Quality Gates"
        Lint[🔍 ESLint]
        Type[📝 TypeScript]
        Test[🧪 Unit Tests]
        Build[🔨 Build Success]
    end
    
    subgraph "📋 Requirements"
        Docs[📚 Documentation]
        Performance[⚡ Performance]
        Security[🔒 Security]
        Accessibility[♿ Accessibility]
    end
    
    Lint --> Type
    Type --> Test
    Test --> Build
    Build --> Docs
    Docs --> Performance
    Performance --> Security
    Security --> Accessibility
```

## 📄 License

This project is licensed under the MIT License.

---

**DriveMate** - Modern Driving School Management System

*Built with ❤️ using Feature-Based Architecture with Next.js, TypeScript, and Redux Toolkit*
