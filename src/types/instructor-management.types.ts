export interface InstructorDocument {
    front: string;
    back?: string;
    verified: boolean;
}

export interface InstructorDocuments {
    drivingLicense: InstructorDocument; // Giấy phép lái xe (mặt trước và sau)
    professionalCertificate: InstructorDocument; // Chứng chỉ hành nghề (1 mặt)
    criminalRecord: InstructorDocument; // Lý lịch tư pháp (1 mặt)
    healthCertificate: InstructorDocument; // Giấy khám sức khỏe (1 mặt)
}

export interface VehicleImages {
    front: string; // Hình ảnh trước xe
    back: string; // Hình ảnh sau xe
    side: string; // Hình ảnh bên hông xe
    interior: string; // Hình ảnh nội thất xe
}

export interface VehicleDocuments {
    registration: InstructorDocument; // Giấy đăng ký xe (mặt trước và sau)
    insurance: InstructorDocument; // Bảo hiểm xe (mặt trước và sau)
    inspection: InstructorDocument; // Giấy đăng kiểm xe (mặt trước và sau)
}

export interface VehicleRegistration {
    id: string;
    brand: string; // Tên hãng xe
    model: string; // Tên mẫu xe
    seats: number; // Số chỗ ngồi
    issueDate: string; // Ngày cấp
    fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid'; // Loại nhiên liệu
    licensePlate: string; // Biển số xe
    ownerName: string; // Họ và tên đăng ký xe
    price: {
        hourly: number;
        daily: number;
        monthly: number;
    };
    images: VehicleImages;
    documents: VehicleDocuments;
}

export interface EmergencyContact {
    name: string; // Họ và tên người liên hệ khẩn cấp
    phone: string; // Số điện thoại liên hệ khẩn cấp
}

export interface InstructorApplication {
    id: string;
    name: string;
    phone: string;
    emergencyContact: EmergencyContact; // Thông tin liên hệ khẩn cấp
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    documents: InstructorDocuments;
    vehicle?: VehicleRegistration; // Xe là optional
}

export interface InstructorManagementData {
    instructors: InstructorApplication[];
}
