import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/app/dashboard",
    icon: () => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill="none"
        >
          <path
            d="M7.08848 4.76243L6.08847 5.54298C4.57181 6.72681 3.81348 7.31873 3.40674 8.15333C3 8.98792 3 9.95205 3 11.8803V13.9715C3 17.7562 3 19.6485 4.17157 20.8243C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8243C21 19.6485 21 17.7562 21 13.9715V11.8803C21 9.95205 21 8.98792 20.5933 8.15333C20.1865 7.31873 19.4282 6.72681 17.9115 5.54298L16.9115 4.76243C14.5521 2.92081 13.3724 2 12 2C10.6276 2 9.44787 2.92081 7.08848 4.76243Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    },
  },
  {
    title: "Requests",
    url: "/app/requests",
    items: [
      {
        title: "All Requests",
        url: "/app/requests",
      },
      {
        title: "Goods Requests",
        url: "/app/requests",
      },
      {
        title: "Services Requests",
        url: "/app/requests",
      },
    ],
    icon: () => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill={"none"}
        >
          <path
            d="M3 14V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M11.3333 10.6667C12.3883 11.7216 13.7778 12.7937 13.7778 12.7937L15.6825 10.8889C15.6825 10.8889 14.6105 9.49939 13.5556 8.44444C12.5006 7.3895 11.1111 6.31746 11.1111 6.31746L9.20635 8.22222C9.20635 8.22222 10.2784 9.61172 11.3333 10.6667ZM11.3333 10.6667L8 14M16 10.5714L13.4603 13.1111M11.4286 6L8.88889 8.53968"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 18H16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    },
  },
  {
    title: "Workplans",
    url: "/app/workplans",
    icon: () => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill="none"
        >
          <path
            d="M14.5 22L14.1845 21.5811C13.4733 20.6369 13.2969 19.1944 13.7468 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M9.5 22L9.8155 21.5811C10.5267 20.6369 10.7031 19.1944 10.2532 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M7 22H17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 7C10.8954 7 10 7.67157 10 8.5C10 9.32843 10.8954 10 12 10C13.1046 10 14 10.6716 14 11.5C14 12.3284 13.1046 13 12 13M12 7C12.8708 7 13.6116 7.4174 13.8862 8M12 7V6M12 13C11.1292 13 10.3884 12.5826 10.1138 12M12 13V14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14 2H10C6.72077 2 5.08116 2 3.91891 2.81382C3.48891 3.1149 3.1149 3.48891 2.81382 3.91891C2 5.08116 2 6.72077 2 10C2 13.2792 2 14.9188 2.81382 16.0811C3.1149 16.5111 3.48891 16.8851 3.91891 17.1862C5.08116 18 6.72077 18 10 18H14C17.2792 18 18.9188 18 20.0811 17.1862C20.5111 16.8851 20.8851 16.5111 21.1862 16.0811C22 14.9188 22 13.2792 22 10C22 6.72077 22 5.08116 21.1862 3.91891C20.8851 3.48891 20.5111 3.1149 20.0811 2.81382C18.9188 2 17.2792 2 14 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    },
  },
];

const settingsItems = [
  {
    title: "Projects",
    url: "/app/projects",
    icon: () => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill={"none"}
        >
          <rect width="24" height="24" fill="white" />
          <path
            d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 10H6.19722C6.91179 10 7.26908 10 7.58952 10.112C7.7852 10.1804 7.96906 10.2788 8.13451 10.4037C8.40544 10.6082 8.60363 10.9054 9 11.5C9.39637 12.0946 9.59456 12.3918 9.86549 12.5963C10.0309 12.7212 10.2148 12.8196 10.4105 12.888C10.7309 13 11.0882 13 11.8028 13H12.1972C12.9118 13 13.2691 13 13.5895 12.888C13.7852 12.8196 13.9691 12.7212 14.1345 12.5963C14.4054 12.3918 14.6036 12.0946 15 11.5C15.3964 10.9054 15.5946 10.6082 15.8655 10.4037C16.0309 10.2788 16.2148 10.1804 16.4105 10.112C16.7309 10 17.0882 10 17.8028 10H22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    },
  },
  {
    title: "Donors",
    url: "/app/donors",
    icon: () => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill="none"
        >
          <path
            d="M4 9.20429C4 7.13113 4 6.09456 4.35762 5.25269C4.65634 4.54947 5.1278 3.94587 5.7219 3.50605C6.43314 2.97951 7.38764 2.79409 9.29665 2.42323C11.2817 2.03759 12.2743 1.84477 13.0467 2.15204C13.6884 2.4073 14.229 2.88941 14.5789 3.5183C15 4.27535 15 5.35324 15 7.50903V16.4909C15 18.6467 15 19.7246 14.5789 20.4816C14.229 21.1105 13.6884 21.5926 13.0467 21.8479C12.2743 22.1552 11.2817 21.9623 9.29665 21.5767C7.38764 21.2058 6.43314 21.0204 5.7219 20.4939C5.1278 20.0541 4.65634 19.4505 4.35762 18.7472C4 17.9054 4 16.8688 4 14.7956V9.20429Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M15 19.7982C16.4473 19.9487 18.3999 20.4116 19.4375 19.0884C20 18.3712 20 17.2786 20 15.0933V8.9066C20 6.72135 20 5.62872 19.4375 4.91149C18.3999 3.58837 16.4473 4.05125 15 4.20173"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 13L12 11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 19.7266L22 19.7266"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 20H5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    },
  },
  {
    title: "Users",
    url: "/app/users",
    icon: () => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill={"none"}
        >
          <path
            d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      );
    },
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-3">
            <div>
              <div className="w-10 h-10 rounded-md bg-black flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  color="#ffffff"
                  fill="none"
                >
                  <path
                    d="M4.31802 19.682C3 18.364 3 16.2426 3 12C3 7.75736 3 5.63604 4.31802 4.31802C5.63604 3 7.75736 3 12 3C16.2426 3 18.364 3 19.682 4.31802C21 5.63604 21 7.75736 21 12C21 16.2426 21 18.364 19.682 19.682C18.364 21 16.2426 21 12 21C7.75736 21 5.63604 21 4.31802 19.682Z"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 14L9.79289 11.2071C10.1834 10.8166 10.8166 10.8166 11.2071 11.2071L12.7929 12.7929C13.1834 13.1834 13.8166 13.1834 14.2071 12.7929L17 10"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-md font-[700] leading-none">
                Sharif Khaleel
              </h1>
              <p className="text-[13px] font-[400] leading-none opacity-80">
                ll.hawk.ll@gmail.com
              </p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => (
                <div key={index}>
                  {item.items ? (
                    <Collapsible
                      key={item.title}
                      defaultOpen
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton asChild>
                            <div className="flex items-center gap-2">
                              <item.icon />
                              <span>{item.title}</span>
                            </div>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuButton asChild>
                                  <a href={subItem.url}>
                                    {/* <subItem.icon /> */}
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
