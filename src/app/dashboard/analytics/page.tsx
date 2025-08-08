
'use client';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Line, LineChart } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { products } from '@/lib/data';

const salesData = [
  { month: 'January', sales: 186, revenue: 80000 },
  { month: 'February', sales: 305, revenue: 95000 },
  { month: 'March', sales: 237, revenue: 75000 },
  { month: 'April', sales: 273, revenue: 110000 },
  { month: 'May', sales: 209, revenue: 98000 },
  { month: 'June', sales: 214, revenue: 105000 },
];

const chartConfig = {
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  },
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

export default function AnalyticsPage() {
    const vendorProducts = products.filter(p => p.vendorId === 'vendor_01'); // Mock
    const totalRevenue = 563000;
    const totalSales = 1424;
    const totalCustomers = 345;
  
    return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 font-headline text-3xl font-bold">Sales Analytics</h1>
      
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalSales}</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendorProducts.length}</div>
            <p className="text-xs text-muted-foreground">Total products listed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Sales & Revenue Overview</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={salesData} >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                     <YAxis
                        yAxisId="left"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        tickFormatter={(value) => `₦${Number(value) / 1000}k`}
                        />
                    <ChartTooltip 
                         cursor={false}
                         content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="sales" fill="var(--color-sales)" radius={4} yAxisId="left" />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} yAxisId="right" />
                </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>
              Your most popular items this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {vendorProducts.slice(0, 4).map((product, index) => (
                <li key={product.id} className="flex items-center gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground font-bold">{index + 1}</div>
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
                  </div>
                  <div className="font-semibold text-right">
                    <p>150 sales</p>
                    <p className="text-xs text-success font-normal">+30%</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
