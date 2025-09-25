import { ArrowRight, Users, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="bg-white">
      {/* Hero Section - Khung 1 */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Content */}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight text-gray-900 lg:text-5xl">
                Bổ túc lái xe an toàn cùng người hướng dẫn chuyên nghiệp
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                DriveMate kết nối bạn với những giáo viên lái xe có kinh nghiệm nhất.
                Học lái xe hiệu quả, an toàn với lịch trình linh hoạt.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="blue" size="lg" asChild>
                  <a href="/signup">Thuê ngay</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="/about">
                    Tìm hiểu thêm
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Giáo viên lái xe đang hướng dẫn học viên"
                className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


