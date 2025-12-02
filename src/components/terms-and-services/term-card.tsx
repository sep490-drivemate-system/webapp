"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TermsItem {
  id: string;
  title: string;
  description: string;
  type: 1 | 2;
}

interface TermsCardProps {
  term: TermsItem;
  userType: 1 | 2;
}

export default function TermsCard({ term, userType }: TermsCardProps) {
  const getIcon = (type: 1 | 2, index: number) => {
    const newDriverIcons = ["⚠️", "🛡️", "✋", "📱"];
    const mentorIcons = ["📝", "⭐", "💼", "🔒"];

    if (type === 1) {
      return newDriverIcons[Number.parseInt(term.id) % newDriverIcons.length];
    } else {
      return mentorIcons[Number.parseInt(term.id) % mentorIcons.length];
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-accent/60 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {term.title}
          </CardTitle>
          <span className="text-3xl flex-shrink-0">
            {getIcon(term.type, Number.parseInt(term.id))}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/75 leading-relaxed text-sm line-clamp-4">
          {term.description}
        </p>
        <div className="mt-4 pt-4 border-t border-border/30 flex items-center text-xs text-muted-foreground">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-medium shadow-sm">
            {userType === 1 ? "Người Lái Mới" : "Người Hướng Dẫn"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
