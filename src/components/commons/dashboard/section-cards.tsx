import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-sm sm:text-base">Total Revenue</CardDescription>
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-semibold tabular-nums">
            $1,250.00
          </CardTitle>
          {/* <CardAction>
            <Badge variant="outline" className="text-xs sm:text-sm">
              <IconTrendingUp className="size-3 sm:size-4" />
              +12.5%
            </Badge>
          </CardAction> */}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs sm:text-sm">
          {/* <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-3 sm:size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div> */}
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-sm sm:text-base">New Customers</CardDescription>
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-semibold tabular-nums">
            1,234
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs sm:text-sm">
              <IconTrendingDown className="size-3 sm:size-4" />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs sm:text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-3 sm:size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-sm sm:text-base">Active Accounts</CardDescription>
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-semibold tabular-nums">
            45,678
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs sm:text-sm">
              <IconTrendingUp className="size-3 sm:size-4" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs sm:text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-3 sm:size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-sm sm:text-base">Growth Rate</CardDescription>
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-semibold tabular-nums">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs sm:text-sm">
              <IconTrendingUp className="size-3 sm:size-4" />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs sm:text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-3 sm:size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}
