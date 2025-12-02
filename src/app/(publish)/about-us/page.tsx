"use client";

import { Card } from "@/components/ui/card";
import {
  Briefcase,
  CheckCircle2,
  Compass,
  Eye,
  Heart,
  Shield,
  Sliders,
  Target,
  Users,
  Zap,
} from "lucide-react";

export default function AboutUsPage() {
  const features = [
    {
      icon: CheckCircle2,
      title: "Huấn luyện viên được xác minh",
      description:
        "Tất cả được kiểm chứng danh tính, bằng cấp và chứng chỉ hành nghề",
    },
    {
      icon: Zap,
      title: "Gói dịch vụ linh hoạt",
      description:
        "Thiết kế bởi huấn luyện viên để phù hợp với nhu cầu luyện tập của bạn",
    },
    {
      icon: Users,
      title: "Xe tập có sẵn",
      description: "Tùy chọn sử dụng xe tập cho những ai chưa có phương tiện",
    },
  ];

  const missions = [
    {
      icon: Target,
      title: "Trao sự tự tin",
      description: "Trao sự tự tin cho người lái mới mỗi khi họ bước lên xe.",
    },
    {
      icon: Briefcase,
      title: "Cơ hội nghề nghiệp",
      description:
        "Tạo cơ hội nghề nghiệp bền vững cho các huấn luyện viên có kỹ năng và chứng chỉ.",
    },
    {
      icon: Heart,
      title: "Cộng đồng an toàn",
      description:
        "Xây dựng cộng đồng giao thông an toàn hơn, nơi ai cũng có thể học, luyện tập và trưởng thành.",
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "An toàn & Tận tâm",
      description:
        "Mỗi buổi huấn luyện được thiết kế để giúp người lái mới tiến bộ từng ngày, giảm lo lắng và tăng khả năng xử lý tình huống thực tế.",
    },
    {
      icon: Eye,
      title: "Minh bạch & Tin cậy",
      description:
        "Tất cả huấn luyện viên đều được xác minh danh tính, bằng cấp và chứng chỉ để đảm bảo chất lượng dịch vụ.",
    },
    {
      icon: Sliders,
      title: "Linh hoạt & Tiện lợi",
      description:
        "Người dùng tự chọn gói, tự sắp xếp lịch, tự chọn người hướng dẫn phù hợp với phong cách và tốc độ học của mình.",
    },
    {
      icon: Compass,
      title: "Đồng hành & Phát triển",
      description:
        "DriveMate không chỉ là nền tảng đặt lịch – chúng tôi là người bạn đồng hành trên hành trình trở thành người lái xe tự tin.",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Giới thiệu */}
      <section id="about" className="pt-32 pb-20 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Giới thiệu về DriveMate
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Nền tảng bảo trợ tay lái cho những người lái mới đã có bằng lái
              nhưng cần thêm sự tự tin
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch mb-12">
            <div className="relative h-64 md:h-full rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 border border-border/50">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/hero_image.png"
                  alt="Huấn luyện viên hướng dẫn người lái mới"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl border border-border p-8 md:p-12 h-full flex flex-col justify-center">
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                DriveMate là nền tảng bảo trợ tay lái dành cho những người lái
                mới – những người đã có bằng lái nhưng cần thêm sự tự tin và
                kinh nghiệm khi bước ra đường.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                Chúng tôi kết nối bạn với các huấn luyện viên giàu kinh nghiệm,
                được xác minh rõ ràng và sở hữu chứng chỉ hành nghề, để mỗi buổi
                tập không chỉ an toàn mà còn thực sự hiệu quả.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                DriveMate mang đến hệ thống gói dịch vụ linh hoạn, được thiết kế
                bởi các huấn luyện viên để phù hợp với từng nhu cầu luyện tập.
                Người lái mới có thể mua gói và chia nhỏ thành nhiều buổi huấn
                luyện phù hợp với lịch trình cá nhân. Một số gói còn có tùy chọn
                sử dụng xe tập dành cho những ai chưa có phương tiện hoặc muốn
                trải nghiệm trước khi tự lái.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-500 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-emerald-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/60">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sứ mệnh */}
      <section id="mission" className="py-20 bg-secondary/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Sứ mệnh của nền tảng
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Ba trụ cột để xây dựng một cộng đồng lái xe tự tin, an toàn và
              chuyên nghiệp
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {missions.map((mission, index) => {
              const Icon = mission.icon;
              return (
                <Card
                  key={index}
                  className="p-8 border border-border bg-background hover:border-primary/50 transition-all group"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-500 flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow">
                    <Icon className="w-8 h-8 text-emerald-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {mission.title}
                  </h3>
                  <p className="text-lg text-foreground/70 leading-relaxed">
                    {mission.description}
                  </p>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 p-8 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-400 border border-emerald-100">
            <p className="text-center text-emerald-900 text-lg leading-relaxed italic">
              Hành trình lái xe của bạn bắt đầu không phải khi lấy bằng, mà khi
              bạn có người bên cạnh, hướng dẫn từng bước. Đó là sứ mệnh của
              DriveMate.
            </p>
          </div>
        </div>
      </section>

      {/* Giá trị */}
      <section id="values" className="py-20 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Giá trị nền tảng mang lại
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Bốn giá trị cốt lõi định hình mỗi quyết định và hành động của
              chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="p-8 border border-border bg-white dark:bg-card hover:shadow-lg transition-all"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-500">
                        <Icon className="h-6 w-6 text-emerald-700" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {value.title}
                      </h3>
                      <p className="text-foreground/70 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <Card className="p-6 border border-emerald-700 bg-gradient-to-br from-emerald-100 to-emerald-500/30 text-center">
              <p className="text-4xl font-bold text-emerald-700 mb-2">99%</p>
              <p className="text-foreground/70">
                Mức độ hài lòng của người dùng
              </p>
            </Card>
            <Card className="p-6 border border-amber-600 bg-gradient-to-br from-amber-100 to-amber-400/40 text-center">
              <p className="text-4xl font-bold text-amber-600 mb-2">5.0</p>
              <p className="text-foreground/70">
                Đánh giá trung bình từ huấn luyện viên
              </p>
            </Card>
            <Card className="p-6 border border-emerald-700 bg-gradient-to-br from-emerald-100 to-emerald-500/30 text-center">
              <p className="text-4xl font-bold text-emerald-700 mb-2">24/7</p>
              <p className="text-foreground/70">
                Hỗ trợ khách hàng luôn sẵn sàng
              </p>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
