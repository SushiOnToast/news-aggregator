import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Testing Card</CardTitle>
        <CardDescription>
          This is testing content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        This is more testing content.
      </CardContent>
    </Card>
  )
}