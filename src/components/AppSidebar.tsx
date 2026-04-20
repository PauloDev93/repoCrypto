import { Activity, Bell, Compass, Gauge, LineChart, Radar, Settings, Star, Waves } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const nav = [
  { title: "Visão Geral", icon: Gauge, active: true },
  { title: "Gráfico Avançado", icon: LineChart },
  { title: "Monitor de Baleias", icon: Waves },
  { title: "Sentimento", icon: Activity },
  { title: "Radar de Stablecoins", icon: Radar },
  { title: "Favoritos", icon: Star },
  { title: "Alertas", icon: Bell },
  { title: "Explorar", icon: Compass },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="relative">
            <div className="h-8 w-8 rounded-md bg-gradient-neon shadow-neon flex items-center justify-center">
              <Activity className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary pulse-neon" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display font-semibold text-sm tracking-tight">Crypto Sentinel</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Command Center</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Operação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.active}
                    className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-primary data-[active=true]:shadow-[inset_2px_0_0_hsl(var(--primary))]"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
