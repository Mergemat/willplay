import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex h-screen w-full max-w-7xl flex-col">
      <div className="my-8 flex items-center justify-between">
        <h1 className="font-bold text-4xl">My Games</h1>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-played">Last Played</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="release-date">Release Date</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Tabs defaultValue="want-to-play">
        <TabsList>
          <TabsTrigger value="want-to-play">Want to Play</TabsTrigger>
          <TabsTrigger value="played">Played</TabsTrigger>
        </TabsList>
        <TabsContent value="want-to-play">
          <div className="grid grid-cols-1 justify-center justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Card className="group w-full max-w-sm" key={i}>
                <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                  <div className="h-full w-full bg-secondary" />
                </div>
                <CardContent className="p-4">
                  <CardTitle className="font-bold text-lg">
                    Game Title
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm">
                    Game Description
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="played">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Placeholder for played games */}
            <p>No played games yet.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
