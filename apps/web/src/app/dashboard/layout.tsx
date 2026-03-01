import { DashboardSidebarProvider, MobileMenuButton } from "@/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardSidebarProvider>
      {/* ── Main Content ─────────────────────────────── */}
      <div className="flex-1 md:ml-64 min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="px-4 md:px-6 py-4 flex items-center gap-3">
            {/* Hamburger — only visible on mobile, wired to the sidebar drawer */}
            <MobileMenuButton />

            {/* Org name — visible on desktop */}
            <div className="flex-1 hidden md:block">
              <h2 className="text-sm font-medium text-gray-500">My Nonprofit</h2>
            </div>

            {/* Push right-side icons to the end on mobile */}
            <div className="flex-1 md:hidden" />

            <div className="flex items-center gap-4">
              {/* Notifications placeholder */}
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
              </button>

              {/* User avatar placeholder */}
              <div className="w-8 h-8 rounded-full bg-give-primary/10 flex items-center justify-center text-xs font-bold text-give-primary">
                U
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </DashboardSidebarProvider>
  );
}
