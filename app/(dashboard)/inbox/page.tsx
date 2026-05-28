import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inboxItems } from "@/features/projects/mock-data";

export default function InboxPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-stone-950">쪽지/알림</h1>
        <p className="mt-2 text-sm text-stone-500">
          읽음 상태와 업무 완료 상태를 분리하고, 알림에서 바로 업무로 이동하는 구조입니다.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>최근 알림</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {inboxItems.map((item) => (
            <div key={item.id} className="rounded-md border border-stone-200 p-3 hover:bg-stone-50">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={item.read ? "secondary" : "default"}>{item.read ? "읽음" : "미읽음"}</Badge>
                <Badge variant={item.completed ? "default" : "outline"}>
                  {item.completed ? "완료 처리" : "업무 진행중"}
                </Badge>
                <span className="text-xs text-stone-500">{item.createdAt}</span>
              </div>
              <p className="mt-2 font-medium text-stone-950">{item.title}</p>
              <p className="text-sm text-stone-500">{item.sender}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
