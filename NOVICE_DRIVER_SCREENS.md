# 📱 NOVICE DRIVER - 4 MÀN HÌNH CHÍNH

Tài liệu này mô tả 4 màn hình cốt lõi đã được implement cho Novice Driver trong hệ thống DriveMate.

---

## 📊 **1. DASHBOARD/HOME** 
**Path**: `/dashboard`  
**File**: `src/app/(publish)/dashboard/page.tsx`

### Mục đích
Trang tổng quan cung cấp cái nhìn tổng thể về hoạt động học tập của Novice Driver.

### Tính năng chính

#### **Stats Cards (4 cards)**
- 📚 **Gói đang học**: Hiển thị số lượng gói active và tổng giờ
- ⏰ **Giờ đã học**: Giờ đã sử dụng và còn lại
- 📅 **Buổi học**: Số buổi đã hoàn thành/tổng buổi
- 📈 **Tiến độ**: % hoàn thành khóa học

#### **Active Packages Section** (2/3 layout)
- Hiển thị tối đa 2 gói đang học
- Mỗi package card bao gồm:
  - Avatar và tên instructor
  - Tên gói
  - Progress bar (used/total hours)
  - Remaining hours & expiry date
  - CTA buttons: "Đặt lịch học" & "Chi tiết"

#### **Recent Sessions**
- 3 buổi học gần nhất đã hoàn thành
- Hiển thị: Instructor, ngày, giờ, duration
- Icon hoàn thành (CheckCircle)

#### **Right Sidebar** (1/3 layout)
- **Upcoming Sessions**: 
  - 3 buổi học sắp tới
  - Status badge (pending/confirmed)
  - Date, time, location
  - "Xem chi tiết" button

- **Quick Actions**:
  - 🚗 Tìm người hướng dẫn
  - 📅 Quản lý lịch học
  - 🛣️ Xem lịch sử
  - 💰 Ví của tôi

- **Achievement Card** (Gradient blue):
  - Tổng km đã đi: 245 km
  - Đánh giá trung bình: 5.0 ⭐
  - Kỹ năng đã học: 6 loại đường
  - "Xem chi tiết tiến độ" button

### Mock Data
- `mock-packages.json`: 3 packages (1 active, 1 completed, 1 new)
- `mock-sessions.json`: 6 sessions (3 completed, 3 upcoming)

---

## 👨‍🏫 **2. INSTRUCTORS LIST**
**Path**: `/instructors`  
**File**: `src/app/(publish)/instructors/page.tsx`

### Mục đích
Cho phép Novice Driver tìm kiếm và lựa chọn người hướng dẫn phù hợp.

### Tính năng chính

#### **Filter Sidebar** (Sticky)
- **Khu vực**: Dropdown với các khu vực unique
- **Kinh nghiệm**:
  - Mới vào nghề (≤5 năm)
  - Có kinh nghiệm (6-10 năm)
  - Chuyên gia (>10 năm)
- **Đánh giá tối thiểu**: 4+, 4.5+, 4.8+ sao
- Button "Xóa bộ lọc"

#### **Instructor Grid** (3 columns)
- **Sort Options**:
  - Đánh giá cao nhất
  - Kinh nghiệm nhiều nhất
  - Giá thấp đến cao
  - Giá cao đến thấp
  - Nhiều đánh giá nhất

- **Instructor Card**:
  - Avatar (16x16)
  - Name + experience badge
  - Bio (line-clamp-3)
  - Location (MapPin icon)
  - Experience level badge
  - Specialties badges (show 2, +N more)
  - Rating stars + review count
  - Price per hour (blue, bold)
  - Action buttons:
    - "Đặt ngay" (primary)
    - "Chi tiết" (outline)

#### **Pagination**
- 6 items per page (3 columns x 2 rows)
- Previous/Next buttons
- Page numbers

#### **Empty State**
- Icon award (16x16, opacity-50)
- "Không tìm thấy người hướng dẫn phù hợp"
- Button "Xóa tất cả bộ lọc"

#### **CTA Section**
- "Bạn muốn trở thành người hướng dẫn?"
- Link to `/signup-instructor`

### Mock Data
- `mock-instructors-enhanced.json`: 20+ instructors
- Filters theo area, experience, rating

---

## 📦 **3. MY PACKAGES**
**Path**: `/my-packages`  
**File**: `src/app/(publish)/my-packages/page.tsx`

### Mục đích
Quản lý các gói học đã mua, theo dõi tiến độ và đặt lịch học.

### Tính năng chính

#### **Quick Stats** (4 cards)
- Gói đang học (blue)
- Giờ đã học (green)
- Giờ còn lại (orange)
- Gói hoàn thành (purple)

#### **Tabs**
1. **Đang học** (Active)
2. **Hoàn thành** (Completed)
3. **Hết hạn** (Expired/Cancelled)

#### **Package Card** (Grid 3 columns)
- **Header**:
  - Instructor avatar + name
  - Package name
  - Status badge (Active/Completed/Expired/Cancelled)

- **Progress Section**:
  - Progress bar
  - 3 columns stats:
    - Đã học (green)
    - Chờ xác nhận (orange)
    - Còn lại (blue)

- **Skills**: Badges với các loại đường

- **Vehicle Info** (if hasVehicle):
  - Car icon
  - Vehicle type + plate number

- **Dates**:
  - Ngày mua
  - Hết hạn

- **Price**:
  - Tổng giá trị (large, blue, bold)
  - Price per hour (small, gray)

- **Actions** (Footer):
  - Active: "Đặt lịch học" + "Xem" + "Hủy"
  - Other: "Xem chi tiết"

#### **Cancel Package Dialog**
- Package info
- Refund calculation:
  - Tổng giá trị gói
  - Giờ đã dùng/còn lại
  - Số tiền hoàn lại (formula-based)
- Warning notes:
  - "Sau 1 tháng không thể hủy"
  - "Không thể hoàn tác"
- Confirmation buttons

#### **Empty States**
- No active: "Chưa có gói học" → Link to instructors
- No completed: "Chưa có gói hoàn thành"
- No expired: "Không có gói hết hạn"

### Mock Data
- `mock-packages.json`: 3 packages with different statuses
- Linked sessions array

---

## 📅 **4. MY SESSIONS**
**Path**: `/my-sessions`  
**File**: `src/app/(publish)/my-sessions/page.tsx`

### Mục đích
Quản lý lịch học: xem upcoming sessions, completed sessions, cancel/reschedule.

### Tính năng chính

#### **Quick Stats** (4 cards)
- Sắp tới (orange)
- Hoàn thành (green)
- Tổng giờ (blue)
- Tổng km (purple)

#### **Tabs**
1. **Sắp tới** (Upcoming): pending + confirmed
2. **Hoàn thành** (Completed)
3. **Đã hủy** (Cancelled)

#### **Session Card**
- **Header**:
  - Instructor avatar + name + phone
  - Status badge with icon

- **Info Section**:
  - 📅 Date (formatted long)
  - ⏰ Time range + duration
  - 📍 Pickup location
  - 🚗 Vehicle info (type, plate)
  - Skills badges

- **Completed Sessions**:
  - Rating stars (if rated)
  - "Đã đánh giá X/5"

- **Actions** (Footer):
  - Upcoming: "Chi tiết" + "Đổi lịch" + "Hủy"
  - Completed (unrated): "Chi tiết" + "Đánh giá"
  - Completed (rated): "Chi tiết" only

#### **Session Details Dialog** (Max-width: 3xl)
Sections:
1. Instructor Info Card (bg-gray-50)
2. Date & Time (2 columns grid)
3. Pickup Location (with MapPin icon)
4. Vehicle Info (bg-blue-50)
5. Route Info:
   - Distance (km)
   - Waypoints list (numbered)
6. Skills practiced (badges)
7. Instructor Notes (bg-yellow-50, if exists)
8. Your Feedback (bg-green-50, if exists)
9. Total Cost (border-top, large blue text)

#### **Cancel Session Dialog**
- Session summary
- Cancellation policy warning:
  - "> 12h: Giờ học hoàn lại"
  - "< 12h: Không hoàn lại"
- Yellow warning box
- Confirmation buttons

#### **Reschedule Dialog**
- Note: "Chỉ có thể đổi trước 24h"
- Calendar placeholder (under development)

#### **Feedback Dialog**
- Star rating selector (1-5, clickable)
- Textarea for comments
- "Gửi đánh giá" button

#### **Empty States**
- No upcoming: "Chưa có buổi học" → Links to packages + instructors
- No completed: "Chưa có buổi hoàn thành"
- No cancelled: "Không có buổi hủy"

### Mock Data
- `mock-sessions.json`: 6 sessions
  - 3 completed (with notes, some with ratings)
  - 2 pending
  - 1 confirmed

---

## 🎨 **UI COMPONENTS SỬ DỤNG**

### shadcn/ui Components
- `Card`, `CardContent`, `CardHeader`, `CardFooter`, `CardTitle`, `CardDescription`
- `Button`
- `Badge`
- `Avatar`, `AvatarImage`, `AvatarFallback`
- `Progress`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`
- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
- `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationNext`, `PaginationPrevious`
- `Textarea`

### Lucide React Icons
- `BookOpen`, `Calendar`, `Clock`, `TrendingUp`, `Award`, `MapPin`, `ArrowRight`
- `CheckCircle`, `XCircle`, `AlertCircle`, `AlertTriangle`
- `Star`, `Car`, `Route`, `Phone`, `Navigation`
- `Eye`, `Plus`, `Trash2`, `RefreshCw`, `X`

---

## 📊 **MOCK DATA STRUCTURE**

### `mock-packages.json`
```json
{
  "packages": [
    {
      "id": "pkg_001",
      "instructorId": "1",
      "instructorName": "...",
      "instructorAvatar": "...",
      "packageName": "...",
      "totalHours": 40,
      "usedHours": 12,
      "pendingHours": 8,
      "remainingHours": 20,
      "pricePerHour": 200000,
      "totalPrice": 8000000,
      "hasVehicle": true,
      "vehicleType": "...",
      "vehiclePlate": "...",
      "skills": ["...", "..."],
      "status": "active",
      "purchaseDate": "ISO 8601",
      "expiryDate": "ISO 8601",
      "sessions": [...]
    }
  ]
}
```

### `mock-sessions.json`
```json
{
  "sessions": [
    {
      "id": "ses_001",
      "packageId": "pkg_001",
      "instructorId": "1",
      "instructorName": "...",
      "instructorAvatar": "...",
      "instructorPhone": "...",
      "date": "YYYY-MM-DD",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "duration": 4,
      "status": "completed|pending|confirmed|cancelled",
      "pickupLocation": "...",
      "pickupCoordinates": { "lat": 0, "lng": 0 },
      "vehicle": {
        "type": "...",
        "plate": "...",
        "color": "..."
      },
      "route": {
        "distance": 45.5,
        "skills": ["...", "..."],
        "waypoints": ["...", "..."],
        "mapUrl": "..."
      },
      "instructorNotes": "...",
      "rating": 5,
      "feedback": "...",
      "actualPrice": 800000,
      "createdAt": "ISO 8601",
      "completedAt": "ISO 8601"
    }
  ]
}
```

---

## 🔄 **USER FLOWS**

### Flow 1: Xem Dashboard → Đặt lịch
1. User vào `/dashboard`
2. Xem "Gói đang học" section
3. Click "Đặt lịch học" trên package card
4. → Redirect to `/booking/schedule?packageId=xxx`

### Flow 2: Tìm Instructor → Xem chi tiết
1. User vào `/instructors`
2. Filter theo area, experience, rating
3. Sort theo preference
4. Click "Chi tiết" trên instructor card
5. → Redirect to `/instructors/[id]` (existing page)

### Flow 3: Quản lý gói → Hủy gói
1. User vào `/my-packages`
2. Tab "Đang học"
3. Click icon "Hủy" trên package card
4. Dialog hiển thị refund calculation
5. Confirm → Package status = 'cancelled'

### Flow 4: Quản lý session → Đánh giá
1. User vào `/my-sessions`
2. Tab "Hoàn thành"
3. Click "Đánh giá" trên session chưa có rating
4. Dialog: Chọn stars + nhập feedback
5. Submit → Session updated với rating + feedback

---

## 🚀 **NEXT STEPS (Recommended)**

### Priority 1 - Backend Integration
- [ ] Tạo API endpoints:
  - GET `/api/packages` - Lấy danh sách gói
  - GET `/api/packages/:id` - Chi tiết gói
  - DELETE `/api/packages/:id` - Hủy gói
  - GET `/api/sessions` - Lấy danh sách session
  - GET `/api/sessions/:id` - Chi tiết session
  - POST `/api/sessions/:id/cancel` - Hủy session
  - POST `/api/sessions/:id/reschedule` - Đổi lịch
  - POST `/api/sessions/:id/feedback` - Gửi đánh giá

- [ ] Tạo Redux slices:
  - `packagesSlice.ts` - State management cho packages
  - `sessionsSlice.ts` - State management cho sessions

- [ ] Tạo thunks:
  - `fetchPackages`, `fetchPackageById`, `cancelPackage`
  - `fetchSessions`, `fetchSessionById`, `cancelSession`, `rescheduleSession`, `submitFeedback`

### Priority 2 - Missing Screens
- [ ] Package Detail Page `/my-packages/[id]`
- [ ] Session Detail Page `/my-sessions/[id]` (optional, có dialog rồi)
- [ ] Booking Flow:
  - [ ] `/booking/select-package`
  - [ ] `/booking/schedule`
  - [ ] `/booking/summary`
  - [ ] `/booking/payment`

### Priority 3 - Features
- [ ] Real-time notifications
- [ ] Calendar integration
- [ ] Map integration (Google Maps API)
- [ ] Image upload for vehicle check
- [ ] Chat với instructor
- [ ] Wallet & payment system

### Priority 4 - UX Improvements
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications (sonner)
- [ ] Skeleton loaders
- [ ] Responsive mobile optimization
- [ ] Accessibility (ARIA labels)

---

## 📱 **NAVIGATION STRUCTURE**

```
Novice Driver Menu:
├── 🏠 Dashboard (/dashboard)
├── 👨‍🏫 Instructors (/instructors)
│   └── [id] - Chi tiết instructor
├── 📦 My Packages (/my-packages)
│   └── [id] - Chi tiết package (TO BE CREATED)
├── 📅 My Sessions (/my-sessions)
│   └── [id] - Chi tiết session (OPTIONAL)
├── 💰 Wallet (/wallet) - TO BE CREATED
├── 📊 Progress (/progress) - TO BE CREATED
└── 🛣️ History (/history) - TO BE CREATED
```

---

## ⚙️ **TECH DETAILS**

- **Framework**: Next.js 15 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **Icons**: Lucide React
- **State**: useState (local) → Will migrate to Redux
- **Data**: JSON mock files → Will connect to API
- **Routing**: Next.js file-based routing
- **Client Components**: "use client" directive

---

## 📝 **NOTES**

1. Tất cả 4 màn hình đều sử dụng **mock data** từ JSON files
2. Không có authentication check (commented out)
3. Không có API integration
4. Không có persistent state (refresh sẽ mất data)
5. Dialog interactions chỉ update local state
6. Cần implement toast notifications cho user feedback

---

**Created**: November 2024  
**Author**: AI Assistant  
**Project**: DriveMate - Driving School Management System

