import { AppSidebar } from "@/components/navbar/appsidebar";
import { ModeToggle } from "@/components/theme/toggle";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <nav className="h-14 w-full bg-sidebar flex items-center justify-between p-4 border-sidebar flex-shrink-0">
          <div>
            <SidebarTrigger size="lg" />
          </div>
          <div>
            <ModeToggle />
          </div>
        </nav>
        <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
