// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { 
//   Calendar,
//   Clock,
//   MapPin,
//   Car as CarIcon,
//   User,
//   Search,
//   Filter,
//   Eye,
//   Star,
//   Phone,
//   Mail
// } from "lucide-react";
// import bookingsData from "@/data/mock-bookings.json";

// interface Booking {
//   id: string;
//   type: "car" | "instructor";
//   carId: string;
//   carName: string;
//   carImage: string;
//   instructorId: string;
//   instructorName: string;
//   instructorAvatar: string;
//   bookingDate: string;
//   startTime: string;
//   endTime: string;
//   duration: string;
//   totalPrice: number;
//   status: "pending" | "confirmed" | "completed" | "cancelled";
//   paymentStatus: "pending" | "paid" | "refunded";
//   location: string;
//   notes: string;
//   createdAt: string;
//   rating?: number;
//   review?: string;
//   cancelReason?: string;
// }

// export default function BookingsPage() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [typeFilter, setTypeFilter] = useState("all");

//   const bookings: Booking[] = bookingsData.bookings;

//   const filteredBookings = bookings.filter((booking) => {
//     const matchesSearch = 
//       booking.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       booking.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
//     const matchesType = typeFilter === "all" || booking.type === typeFilter;
    
//     return matchesSearch && matchesStatus && matchesType;
//   });

//   const getStatusBadge = (status: string) => {
//     const statusConfig = {
//       pending: { label: "Chờ xác nhận", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
//       confirmed: { label: "Đã xác nhận", variant: "default" as const, color: "bg-blue-100 text-blue-800" },
//       completed: { label: "Hoàn thành", variant: "default" as const, color: "bg-green-100 text-green-800" },
//       cancelled: { label: "Đã hủy", variant: "destructive" as const, color: "bg-red-100 text-red-800" }
//     };
    
//     const config = statusConfig[status as keyof typeof statusConfig];
//     return (
//       <Badge className={config.color}>
//         {config.label}
//       </Badge>
//     );
//   };

//   const getPaymentBadge = (status: string) => {
//     const paymentConfig = {
//       pending: { label: "Chờ thanh toán", color: "bg-orange-100 text-orange-800" },
//       paid: { label: "Đã thanh toán", color: "bg-green-100 text-green-800" },
//       refunded: { label: "Đã hoàn tiền", color: "bg-gray-100 text-gray-800" }
//     };
    
//     const config = paymentConfig[status as keyof typeof paymentConfig];
//     return (
//       <Badge className={config.color}>
//         {config.label}
//       </Badge>
//     );
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND'
//     }).format(price);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('vi-VN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   const renderStars = (rating: number) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <Star
//         key={i}
//         className={`h-4 w-4 ${
//           i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
//         }`}
//       />
//     ));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">Lịch sử đặt lịch</h1>
//           <p className="text-gray-600">Quản lý và theo dõi các lịch đặt xe và học lái của bạn</p>
//         </div>

//         {/* Filters */}
//         <Card className="mb-6">
//           <CardContent className="pt-6">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Tìm kiếm theo tên xe, giáo viên hoặc mã đặt lịch..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
              
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Trạng thái" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">Tất cả trạng thái</SelectItem>
//                   <SelectItem value="pending">Chờ xác nhận</SelectItem>
//                   <SelectItem value="confirmed">Đã xác nhận</SelectItem>
//                   <SelectItem value="completed">Hoàn thành</SelectItem>
//                   <SelectItem value="cancelled">Đã hủy</SelectItem>
//                 </SelectContent>
//               </Select>

//               <Select value={typeFilter} onValueChange={setTypeFilter}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Loại đặt lịch" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">Tất cả loại</SelectItem>
//                   <SelectItem value="car">Thuê xe</SelectItem>
//                   <SelectItem value="instructor">Học lái</SelectItem>
//                 </SelectContent>
//               </Select>

//               <div className="flex items-center gap-2">
//                 <Filter className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm text-gray-600">
//                   {filteredBookings.length} kết quả
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Bookings List */}
//         <div className="space-y-4">
//           {filteredBookings.length === 0 ? (
//             <Card>
//               <CardContent className="py-12 text-center">
//                 <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy lịch đặt nào</h3>
//                 <p className="text-gray-500 mb-4">Thử thay đổi bộ lọc hoặc tạo lịch đặt mới</p>
//                 <div className="space-x-4">
//                   <Link href="/cars">
//                     <Button>Thuê xe</Button>
//                   </Link>
//                   <Link href="/instructors">
//                     <Button variant="outline">Tìm giáo viên</Button>
//                   </Link>
//                 </div>
//               </CardContent>
//             </Card>
//           ) : (
//             filteredBookings.map((booking) => (
//               <Card key={booking.id} className="hover:shadow-md transition-shadow">
//                 <CardContent className="p-6">
//                   <div className="flex flex-col lg:flex-row gap-6">
//                     {/* Left: Car/Instructor Info */}
//                     <div className="flex gap-4 flex-1">
//                       <img
//                         src={booking.carImage}
//                         alt={booking.carName}
//                         className="w-20 h-20 object-cover rounded-lg"
//                       />
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-2">
//                           <Badge variant="outline" className="text-xs">
//                             {booking.type === 'car' ? (
//                               <>
//                                 <CarIcon className="h-3 w-3 mr-1" />
//                                 Thuê xe
//                               </>
//                             ) : (
//                               <>
//                                 <User className="h-3 w-3 mr-1" />
//                                 Học lái
//                               </>
//                             )}
//                           </Badge>
//                           <span className="text-sm text-gray-500">#{booking.id}</span>
//                         </div>
                        
//                         <h3 className="font-semibold text-lg mb-1">{booking.carName}</h3>
                        
//                         <div className="flex items-center gap-2 mb-2">
//                           <Avatar className="h-6 w-6">
//                             <AvatarImage src={booking.instructorAvatar} alt={booking.instructorName} />
//                             <AvatarFallback>{booking.instructorName.charAt(0)}</AvatarFallback>
//                           </Avatar>
//                           <span className="text-sm text-gray-600">{booking.instructorName}</span>
//                         </div>

//                         {booking.rating && (
//                           <div className="flex items-center gap-1">
//                             {renderStars(booking.rating)}
//                             <span className="text-sm text-gray-500 ml-1">({booking.rating}/5)</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Center: Booking Details */}
//                     <div className="flex-1 space-y-2">
//                       <div className="flex items-center gap-2 text-sm">
//                         <Calendar className="h-4 w-4 text-gray-500" />
//                         <span>{formatDate(booking.bookingDate)}</span>
//                       </div>
                      
//                       <div className="flex items-center gap-2 text-sm">
//                         <Clock className="h-4 w-4 text-gray-500" />
//                         <span>{booking.startTime} - {booking.endTime} ({booking.duration})</span>
//                       </div>
                      
//                       <div className="flex items-center gap-2 text-sm">
//                         <MapPin className="h-4 w-4 text-gray-500" />
//                         <span>{booking.location}</span>
//                       </div>

//                       {booking.notes && (
//                         <p className="text-sm text-gray-600 italic">"{booking.notes}"</p>
//                       )}
//                     </div>

//                     {/* Right: Status and Actions */}
//                     <div className="flex flex-col items-end gap-3 min-w-[200px]">
//                       <div className="text-right">
//                         <div className="text-lg font-bold text-blue-600 mb-1">
//                           {formatPrice(booking.totalPrice)}
//                         </div>
//                         <div className="space-y-1">
//                           {getStatusBadge(booking.status)}
//                           {getPaymentBadge(booking.paymentStatus)}
//                         </div>
//                       </div>

//                       <div className="flex gap-2">
//                         <Link href={`/bookings/${booking.id}`}>
//                           <Button size="sm" variant="outline" className="gap-2">
//                             <Eye className="h-4 w-4" />
//                             Chi tiết
//                           </Button>
//                         </Link>
                        
//                         {booking.status === 'confirmed' && (
//                           <div className="flex gap-1">
//                             <Button size="sm" variant="ghost" className="p-2">
//                               <Phone className="h-4 w-4" />
//                             </Button>
//                             <Button size="sm" variant="ghost" className="p-2">
//                               <Mail className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         )}
//                       </div>

//                       {booking.review && (
//                         <div className="text-xs text-gray-500 text-right max-w-[200px]">
//                           "{booking.review}"
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </div>

//         {/* Pagination could be added here if needed */}
//       </div>
//     </div>
//   );
// }
