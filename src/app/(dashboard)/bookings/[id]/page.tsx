// "use client";

// import { useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
// import { 
//   ArrowLeft,
//   Calendar,
//   Clock,
//   MapPin,
//   Car as CarIcon,
//   User,
//   Star,
//   Phone,
//   Mail,
//   MessageCircle,
//   Download,
//   CreditCard,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   RefreshCw
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

// export default function BookingDetailPage() {
//   const params = useParams();
//   const bookingId = params.id as string;
  
//   const booking: Booking | undefined = bookingsData.bookings.find(b => b.id === bookingId);
  
//   if (!booking) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold mb-4">Không tìm thấy lịch đặt</h1>
//           <Link href="/bookings">
//             <Button>Quay lại danh sách</Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const getStatusIcon = (status: string) => {
//     const icons = {
//       pending: <Clock className="h-5 w-5 text-yellow-500" />,
//       confirmed: <CheckCircle className="h-5 w-5 text-blue-500" />,
//       completed: <CheckCircle className="h-5 w-5 text-green-500" />,
//       cancelled: <XCircle className="h-5 w-5 text-red-500" />
//     };
//     return icons[status as keyof typeof icons];
//   };

//   const getStatusBadge = (status: string) => {
//     const statusConfig = {
//       pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
//       confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
//       completed: { label: "Hoàn thành", color: "bg-green-100 text-green-800" },
//       cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800" }
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
//       weekday: 'long',
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   const formatDateTime = (dateString: string) => {
//     return new Date(dateString).toLocaleString('vi-VN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
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
//         <div className="mb-6">
//           <Link href="/bookings">
//             <Button variant="ghost" className="gap-2 mb-4">
//               <ArrowLeft className="h-4 w-4" />
//               Quay lại danh sách
//             </Button>
//           </Link>
          
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold mb-2">Chi tiết đặt lịch #{booking.id}</h1>
//               <p className="text-gray-600">Thông tin chi tiết về lịch đặt của bạn</p>
//             </div>
            
//             <div className="flex items-center gap-3">
//               {getStatusIcon(booking.status)}
//               {getStatusBadge(booking.status)}
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Booking Overview */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   {booking.type === 'car' ? (
//                     <CarIcon className="h-5 w-5" />
//                   ) : (
//                     <User className="h-5 w-5" />
//                   )}
//                   Thông tin {booking.type === 'car' ? 'thuê xe' : 'học lái'}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex gap-4 mb-6">
//                   <img
//                     src={booking.carImage}
//                     alt={booking.carName}
//                     className="w-24 h-24 object-cover rounded-lg"
//                   />
//                   <div className="flex-1">
//                     <h3 className="text-xl font-bold mb-2">{booking.carName}</h3>
//                     <div className="flex items-center gap-2 mb-2">
//                       <Avatar className="h-8 w-8">
//                         <AvatarImage src={booking.instructorAvatar} alt={booking.instructorName} />
//                         <AvatarFallback>{booking.instructorName.charAt(0)}</AvatarFallback>
//                       </Avatar>
//                       <span className="font-medium">{booking.instructorName}</span>
//                     </div>
//                     <Badge variant="outline" className="text-xs">
//                       {booking.type === 'car' ? 'Thuê xe' : 'Học lái xe'}
//                     </Badge>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                     <Calendar className="h-5 w-5 text-gray-500" />
//                     <div>
//                       <div className="text-sm text-gray-500">Ngày học</div>
//                       <div className="font-medium">{formatDate(booking.bookingDate)}</div>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                     <Clock className="h-5 w-5 text-gray-500" />
//                     <div>
//                       <div className="text-sm text-gray-500">Thời gian</div>
//                       <div className="font-medium">{booking.startTime} - {booking.endTime}</div>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                     <MapPin className="h-5 w-5 text-gray-500" />
//                     <div>
//                       <div className="text-sm text-gray-500">Địa điểm</div>
//                       <div className="font-medium">{booking.location}</div>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                     <RefreshCw className="h-5 w-5 text-gray-500" />
//                     <div>
//                       <div className="text-sm text-gray-500">Thời lượng</div>
//                       <div className="font-medium">{booking.duration}</div>
//                     </div>
//                   </div>
//                 </div>

//                 {booking.notes && (
//                   <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//                     <div className="text-sm text-blue-600 font-medium mb-1">Ghi chú</div>
//                     <p className="text-blue-800">{booking.notes}</p>
//                   </div>
//                 )}

//                 {booking.cancelReason && (
//                   <div className="mt-4 p-3 bg-red-50 rounded-lg">
//                     <div className="text-sm text-red-600 font-medium mb-1">Lý do hủy</div>
//                     <p className="text-red-800">{booking.cancelReason}</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Review Section */}
//             {booking.rating && booking.review && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
//                     Đánh giá của bạn
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex items-center gap-2 mb-3">
//                     {renderStars(booking.rating)}
//                     <span className="font-medium">({booking.rating}/5)</span>
//                   </div>
//                   <p className="text-gray-700">{booking.review}</p>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Timeline */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Lịch sử trạng thái</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                       <CheckCircle className="h-4 w-4 text-green-600" />
//                     </div>
//                     <div>
//                       <div className="font-medium">Đặt lịch thành công</div>
//                       <div className="text-sm text-gray-500">{formatDateTime(booking.createdAt)}</div>
//                     </div>
//                   </div>
                  
//                   {booking.status !== 'pending' && (
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                         <CheckCircle className="h-4 w-4 text-blue-600" />
//                       </div>
//                       <div>
//                         <div className="font-medium">Đã xác nhận</div>
//                         <div className="text-sm text-gray-500">Lịch học đã được xác nhận</div>
//                       </div>
//                     </div>
//                   )}
                  
//                   {booking.status === 'completed' && (
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                         <CheckCircle className="h-4 w-4 text-green-600" />
//                       </div>
//                       <div>
//                         <div className="font-medium">Hoàn thành</div>
//                         <div className="text-sm text-gray-500">Buổi học đã hoàn thành</div>
//                       </div>
//                     </div>
//                   )}
                  
//                   {booking.status === 'cancelled' && (
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
//                         <XCircle className="h-4 w-4 text-red-600" />
//                       </div>
//                       <div>
//                         <div className="font-medium">Đã hủy</div>
//                         <div className="text-sm text-gray-500">Lịch học đã bị hủy</div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Payment Info */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <CreditCard className="h-5 w-5" />
//                   Thông tin thanh toán
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span>Tổng tiền:</span>
//                     <span className="font-bold text-lg text-blue-600">
//                       {formatPrice(booking.totalPrice)}
//                     </span>
//                   </div>
                  
//                   <Separator />
                  
//                   <div className="flex justify-between items-center">
//                     <span>Trạng thái:</span>
//                     {getPaymentBadge(booking.paymentStatus)}
//                   </div>
                  
//                   {booking.paymentStatus === 'pending' && (
//                     <Button className="w-full mt-4">
//                       <CreditCard className="h-4 w-4 mr-2" />
//                       Thanh toán ngay
//                     </Button>
//                   )}
                  
//                   {booking.paymentStatus === 'paid' && (
//                     <Button variant="outline" className="w-full mt-4">
//                       <Download className="h-4 w-4 mr-2" />
//                       Tải hóa đơn
//                     </Button>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Contact Info */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Liên hệ</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="flex items-center gap-3">
//                     <Avatar className="h-12 w-12">
//                       <AvatarImage src={booking.instructorAvatar} alt={booking.instructorName} />
//                       <AvatarFallback>{booking.instructorName.charAt(0)}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <div className="font-medium">{booking.instructorName}</div>
//                       <div className="text-sm text-gray-500">Giáo viên hướng dẫn</div>
//                     </div>
//                   </div>
                  
//                   <div className="flex gap-2">
//                     <Button size="sm" variant="outline" className="flex-1">
//                       <Phone className="h-4 w-4 mr-2" />
//                       Gọi
//                     </Button>
//                     <Button size="sm" variant="outline" className="flex-1">
//                       <MessageCircle className="h-4 w-4 mr-2" />
//                       Nhắn tin
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Actions */}
//             {booking.status === 'confirmed' && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Hành động</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     <Button variant="outline" className="w-full">
//                       Thay đổi lịch
//                     </Button>
//                     <Button variant="destructive" className="w-full">
//                       Hủy lịch
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Support */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Hỗ trợ</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="flex items-center gap-2 text-sm">
//                     <Phone className="h-4 w-4 text-gray-500" />
//                     <span>1900 1234</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm">
//                     <Mail className="h-4 w-4 text-gray-500" />
//                     <span>support@drivemate.vn</span>
//                   </div>
//                   <Button variant="outline" size="sm" className="w-full">
//                     <MessageCircle className="h-4 w-4 mr-2" />
//                     Liên hệ hỗ trợ
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
