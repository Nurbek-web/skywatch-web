import { HumidityGraph } from "@/components/charts/humidity-graph";
import { InteractiveChart } from "@/components/charts/interactive-chart";
import AreaGraph from "@/components/charts/temperature-graph";
import PageContainer from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export default function Page() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Skywatch бақылау тақтасына қош келдіңіз 🌾
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            {/* Қысқаша карталар */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Қамтылған аумақ
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">320 гектар</div>
                  <p className="text-xs text-muted-foreground">
                    Өткен аймен салыстырғанда +15%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Орташа температура
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l2.52 4.36" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">22°C</div>
                  <p className="text-xs text-muted-foreground">
                    Өткен аймен салыстырғанда +2°C
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Арамшөптерді анықтау
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+1,234</div>
                  <p className="text-xs text-muted-foreground">
                    Арамшөптер саны 30%-ға азайды
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Орташа ылғалдылық
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">65%</div>
                  <p className="text-xs text-muted-foreground">
                    Өткен аймен салыстырғанда +5%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Температура және ылғалдылық графиктері */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
              {/* Температура графигі */}
              <div className="h-[400px]">
                <AreaGraph />
              </div>
              {/* Ылғалдылық графигі */}
              <div className="h-[400px]">
                <HumidityGraph />
              </div>
            </div>
            {/* Interactive Chart */}
            <div className="h-[400px]">
              <InteractiveChart />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}

// // Температура және ылғалдылық графиктеріне арналған мысал деректер
// const temperatureData = [
//   { time: "00:00", value: 20 },
//   { time: "06:00", value: 21 },
//   { time: "12:00", value: 23 },
//   { time: "18:00", value: 22 },
//   { time: "00:00", value: 21 },
// ];

// const humidityData = [
//   { time: "00:00", value: 60 },
//   { time: "06:00", value: 62 },
//   { time: "12:00", value: 65 },
//   { time: "18:00", value: 64 },
//   { time: "00:00", value: 63 },
// ];

// // Interactive chart data
// const interactiveData = [
//   { date: "2024-04-01", temperature: 22, humidity: 60 },
//   { date: "2024-04-02", temperature: 23, humidity: 62 },
//   { date: "2024-04-03", temperature: 24, humidity: 65 },
//   { date: "2024-04-04", temperature: 25, humidity: 64 },
//   { date: "2024-04-05", temperature: 26, humidity: 63 },
//   { date: "2024-04-06", temperature: 27, humidity: 64 },
//   { date: "2024-04-07", temperature: 28, humidity: 65 },
//   { date: "2024-04-08", temperature: 29, humidity: 66 },
//   { date: "2024-04-09", temperature: 30, humidity: 67 },
// ];
