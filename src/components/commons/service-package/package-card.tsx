"use client";

import { Trash2, Clock, Wrench, Route, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Package {
  id: number;
  title: string;
  skills: string[];
  roadTypes: string[];
  duration: string;
  carOption: string;
  price: number;
}

interface PackageCardProps {
  package: Package;
  onDelete: (id: number) => void;
  formatCurrency: (value: number) => string;
}

export function PackageCard({
  package: pkg,
  onDelete,
  formatCurrency,
}: PackageCardProps) {
  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col">
      {/* Card Header with accent bar */}
      <div className="border-l-4 border-emerald-600 bg-gradient-to-r from-emerald-50 to-white p-6">
        <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col gap-4">
        {/* Price Section */}
        <div className="bg-emerald-50 rounded-lg p-4 border-l-4 border-emerald-600">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
            Giá
          </p>
          <p className="text-2xl font-bold text-emerald-600">
            {formatCurrency(pkg.price)}
          </p>
        </div>

        {/* Info Items */}
        <div className="space-y-3">
          {/* Duration */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Thời lượng
              </p>
              <p className="text-sm text-gray-900 mt-1">{pkg.duration}</p>
            </div>
          </div>

          {/* Skills */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Wrench className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Kỹ năng
              </p>
              <p className="text-sm text-gray-900 mt-1">
                {pkg.skills.join(", ")}
              </p>
            </div>
          </div>

          {/* Road Types */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Route className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Loại đường
              </p>
              <p className="text-sm text-gray-900 mt-1">
                {pkg.roadTypes.join(", ")}
              </p>
            </div>
          </div>

          {/* Car Option */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Car className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Xe
              </p>
              <p className="text-sm text-gray-900 mt-1">{pkg.carOption}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer - Actions */}
      <div className="border-t border-gray-200 bg-gray-50 p-4 flex gap-3">
        <Button
          onClick={() => console.log("Chi tiết:", pkg.id)}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
        >
          Chi tiết
        </Button>
        <Button
          onClick={() => onDelete(pkg.id)}
          variant="outline"
          className="bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          size="icon"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
}
