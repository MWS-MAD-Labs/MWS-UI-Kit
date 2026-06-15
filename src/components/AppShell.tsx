import { type ReactNode, useId, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  Grid3X3,
  Menu,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { Badge, Button, Card, IconButton } from "./UIPrimitives";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type NavigationItem = {
  label: string;
  href: string;
  icon?: ReactNode;
  current?: boolean;
  badge?: string | number;
  children?: NavigationItem[];
};

export type AppSwitcherItem = {
  label: string;
  description?: string;
  href: string;
  icon?: ReactNode;
  current?: boolean;
};

export type NotificationItem = {
  id: string;
  title: string;
  description?: string;
  time?: string;
  unread?: boolean;
  tone?: "info" | "success" | "warning" | "error";
  href?: string;
};

export type UserMenuItem = {
  label: string;
  href?: string;
  onSelect?: () => void;
  tone?: "default" | "danger";
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type PageHeaderAction = {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "outline" | "soft" | "ghost" | "gold" | "destructive";
};

export type AppShellProps = {
  appName: string;
  appDescription?: string;
  logo?: ReactNode;
  navigation: NavigationItem[];
  breadcrumbs?: BreadcrumbItem[];
  topBar?: ReactNode;
  children: ReactNode;
  sidebarFooter?: ReactNode;
  userMenu?: ReactNode;
  appSwitcher?: ReactNode;
  notificationCenter?: ReactNode;
};

export function AppShell({
  appName,
  appDescription,
  logo,
  navigation,
  breadcrumbs,
  topBar,
  children,
  sidebarFooter,
  userMenu,
  appSwitcher,
  notificationCenter,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-base text-primary">
      <a
        href="#main-content"
        className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-surface-card focus:px-4 focus:py-2 focus:text-brand focus:shadow-lg"
      >
        Skip to main content
      </a>

      <div className="lg:hidden">
        <TopBar
          appName={appName}
          logo={logo}
          onMenuClick={() => setMobileOpen(true)}
          appSwitcher={appSwitcher}
          notificationCenter={notificationCenter}
          userMenu={userMenu}
        />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Application navigation">
          <button
            className="absolute inset-0 bg-[rgb(36_23_24/0.45)]"
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex h-full w-[min(22rem,calc(100vw-3rem))] flex-col border-r border-subtle bg-surface-card shadow-xl">
            <div className="flex items-center justify-between border-b border-subtle p-4">
              <BrandLockup appName={appName} appDescription={appDescription} logo={logo} />
              <IconButton icon={<X className="size-4" />} label="Close navigation" onClick={() => setMobileOpen(false)} />
            </div>
            <Sidebar navigation={navigation} footer={sidebarFooter} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:grid lg:min-h-screen lg:grid-cols-[18rem_1fr]">
        <aside className="hidden border-r border-subtle bg-surface-card lg:flex lg:flex-col">
          <div className="border-b border-subtle p-5">
            <BrandLockup appName={appName} appDescription={appDescription} logo={logo} />
          </div>
          <Sidebar navigation={navigation} footer={sidebarFooter} />
        </aside>

        <div className="min-w-0">
          <div className="hidden lg:block">
            {topBar ?? (
              <TopBar
                appName={appName}
                appSwitcher={appSwitcher}
                notificationCenter={notificationCenter}
                userMenu={userMenu}
              />
            )}
          </div>
          <main id="main-content" className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">
            {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} className="mb-6" /> : null}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

function BrandLockup({ appName, appDescription, logo }: { appName: string; appDescription?: string; logo?: ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-11 shrink-0 items-center justify-center radius-lg bg-brand-primary text-inverse shadow-brand">
        {logo ?? <span className="heading-font text-sm font-extrabold">MWS</span>}
      </div>
      <div className="min-w-0">
        <p className="heading-font truncate text-sm font-extrabold text-brand">{appName}</p>
        {appDescription ? <p className="truncate text-xs text-tertiary">{appDescription}</p> : null}
      </div>
    </div>
  );
}

export function Sidebar({
  navigation,
  footer,
  onNavigate,
  className = "",
}: {
  navigation: NavigationItem[];
  footer?: ReactNode;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <div className={cx("flex min-h-0 flex-1 flex-col", className)}>
      <nav className="flex-1 overflow-y-auto p-4" aria-label="Primary navigation">
        <ul className="grid gap-1">
          {navigation.map((item) => (
            <SidebarItem key={item.href} item={item} onNavigate={onNavigate} />
          ))}
        </ul>
      </nav>
      {footer ? <div className="border-t border-subtle p-4">{footer}</div> : null}
    </div>
  );
}

function SidebarItem({ item, onNavigate }: { item: NavigationItem; onNavigate?: () => void }) {
  const [expanded, setExpanded] = useState(Boolean(item.current));
  const hasChildren = Boolean(item.children?.length);
  const content = (
    <>
      {item.icon ? <span className="shrink-0 text-tertiary group-[.is-current]:text-brand">{item.icon}</span> : null}
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.badge ? <Badge tone="neutral">{item.badge}</Badge> : null}
      {hasChildren ? <ChevronDown className={cx("size-4 transition", expanded && "rotate-180")} aria-hidden="true" /> : null}
    </>
  );

  return (
    <li>
      {hasChildren ? (
        <button
          className={cx(
            "focus-ring heading-font group flex w-full items-center gap-3 radius-lg px-3 py-2.5 text-left text-sm font-bold transition hover:bg-surface-base hover:text-brand",
            item.current ? "is-current bg-brand-primary-soft text-brand" : "text-secondary",
          )}
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {content}
        </button>
      ) : (
        <a
          className={cx(
            "focus-ring heading-font group flex items-center gap-3 radius-lg px-3 py-2.5 text-sm font-bold transition hover:bg-surface-base hover:text-brand",
            item.current ? "is-current bg-brand-primary-soft text-brand" : "text-secondary",
          )}
          href={item.href}
          aria-current={item.current ? "page" : undefined}
          onClick={onNavigate}
        >
          {content}
        </a>
      )}
      {hasChildren && expanded ? (
        <ul className="ml-6 mt-1 grid gap-1 border-l border-subtle pl-3">
          {item.children?.map((child) => (
            <SidebarItem key={child.href} item={child} onNavigate={onNavigate} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function TopBar({
  appName,
  logo,
  onMenuClick,
  appSwitcher,
  notificationCenter,
  userMenu,
  search,
  className = "",
}: {
  appName: string;
  logo?: ReactNode;
  onMenuClick?: () => void;
  appSwitcher?: ReactNode;
  notificationCenter?: ReactNode;
  userMenu?: ReactNode;
  search?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cx("sticky top-0 z-40 border-b border-subtle bg-[color-mix(in_srgb,var(--mws-color-surface-base)_90%,transparent)] backdrop-blur-xl", className)}>
      <div className="flex min-h-16 items-center gap-3 px-4 md:px-6 lg:px-8">
        {onMenuClick ? <IconButton icon={<Menu className="size-5" />} label="Open navigation" onClick={onMenuClick} /> : null}
        <div className="lg:hidden">
          <BrandLockup appName={appName} logo={logo} />
        </div>
        <div className="hidden min-w-0 flex-1 lg:block">
          {search ?? <GlobalSearchPlaceholder />}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {appSwitcher}
          {notificationCenter}
          {userMenu}
        </div>
      </div>
    </header>
  );
}

function GlobalSearchPlaceholder() {
  return (
    <div className="flex max-w-md items-center gap-2 radius-full border border-subtle bg-surface-card px-4 py-2 text-sm text-tertiary">
      <Search className="size-4" aria-hidden="true" />
      <span>Search MWS records, tools, and actions</span>
    </div>
  );
}

export function Breadcrumbs({ items, className = "" }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav className={className} aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-tertiary">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {item.href && !isLast ? (
                <a className="focus-ring radius-sm font-semibold text-link hover:text-[var(--mws-color-text-link-hover)]" href={item.href}>
                  {item.label}
                </a>
              ) : (
                <span className={cx(isLast && "font-semibold text-primary")} aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  badge,
  actions = [],
  meta,
  className = "",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  actions?: PageHeaderAction[];
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow ? <p className="heading-font mb-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-gold">{eyebrow}</p> : null}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="heading-font text-3xl font-extrabold tracking-tight text-primary md:text-4xl">{title}</h1>
          {badge}
        </div>
        {description ? <p className="mt-3 max-w-3xl text-lg leading-8 text-secondary">{description}</p> : null}
        {meta ? <div className="mt-4 text-sm text-tertiary">{meta}</div> : null}
      </div>
      {actions.length ? (
        <div className="flex flex-wrap gap-3 lg:justify-end">
          {actions.map((action) => (
            <Button key={action.label} href={action.href} onClick={action.onClick} variant={action.variant ?? "primary"}>
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function UserMenu({
  name,
  role,
  avatar,
  items,
  className = "",
}: {
  name: string;
  role?: string;
  avatar?: ReactNode;
  items: UserMenuItem[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <div className={cx("relative", className)}>
      <button
        className="focus-ring flex items-center gap-3 radius-full border border-subtle bg-surface-card py-1.5 pl-2 pr-3 text-left transition hover:bg-surface-base"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex size-9 items-center justify-center radius-full bg-brand-primary-soft text-brand">
          {avatar ?? <UserRound className="size-4" />}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="heading-font block truncate text-sm font-bold text-primary">{name}</span>
          {role ? <span className="block truncate text-xs text-tertiary">{role}</span> : null}
        </span>
        <ChevronDown className={cx("size-4 text-tertiary transition", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open ? (
        <div id={menuId} role="menu" className="absolute right-0 mt-2 w-56 overflow-hidden radius-lg border border-subtle bg-surface-elevated p-2 shadow-lg">
          {items.map((item) => {
            const classes = cx(
              "focus-ring block w-full radius-md px-3 py-2 text-left text-sm font-semibold transition hover:bg-surface-base",
              item.tone === "danger" ? "text-status-error" : "text-secondary hover:text-brand",
            );
            if (item.href) {
              return (
                <a key={item.label} className={classes} href={item.href} role="menuitem" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              );
            }
            return (
              <button
                key={item.label}
                className={classes}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  item.onSelect?.();
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function AppSwitcher({
  apps,
  label = "Open app switcher",
}: {
  apps: AppSwitcherItem[];
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <div className="relative">
      <IconButton icon={<Grid3X3 className="size-5" />} label={label} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls={menuId} />
      {open ? (
        <Card id={menuId} role="menu" className="absolute right-0 mt-2 w-80 p-3 shadow-lg" padding="compact">
          <p className="heading-font px-2 pb-2 text-sm font-bold text-primary">MWS applications</p>
          <div className="grid gap-1">
            {apps.map((app) => (
              <a
                key={app.href}
                className={cx(
                  "focus-ring flex gap-3 radius-lg p-3 transition hover:bg-surface-base",
                  app.current && "bg-brand-primary-soft",
                )}
                href={app.href}
                role="menuitem"
                aria-current={app.current ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <span className="flex size-10 shrink-0 items-center justify-center radius-lg bg-surface-base text-brand">{app.icon ?? <Grid3X3 className="size-4" />}</span>
                <span>
                  <span className="heading-font block text-sm font-bold text-primary">{app.label}</span>
                  {app.description ? <span className="mt-0.5 block text-xs leading-5 text-tertiary">{app.description}</span> : null}
                </span>
              </a>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}

export function NotificationCenter({
  notifications,
  onMarkAllRead,
  label = "Open notifications",
}: {
  notifications: NotificationItem[];
  onMarkAllRead?: () => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const unreadCount = notifications.filter((notification) => notification.unread).length;

  return (
    <div className="relative">
      <button
        className="focus-ring relative flex size-11 items-center justify-center radius-full text-brand transition hover:bg-brand-primary-soft"
        type="button"
        aria-label={unreadCount ? `${label}, ${unreadCount} unread` : label}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell className="size-5" aria-hidden="true" />
        {unreadCount ? <span className="absolute right-1.5 top-1.5 size-2.5 radius-full bg-brand-gold" aria-hidden="true" /> : null}
      </button>
      {open ? (
        <Card id={panelId} className="absolute right-0 mt-2 w-[min(24rem,calc(100vw-2rem))] p-0 shadow-lg" padding="none">
          <div className="flex items-center justify-between border-b border-subtle p-4">
            <div>
              <p className="heading-font font-bold text-primary">Notifications</p>
              <p className="text-xs text-tertiary">{unreadCount ? `${unreadCount} unread` : "All caught up"}</p>
            </div>
            {onMarkAllRead ? (
              <button className="focus-ring radius-sm text-sm font-bold text-link" type="button" onClick={onMarkAllRead}>
                Mark all read
              </button>
            ) : null}
          </div>
          <div className="max-h-96 overflow-y-auto p-2">
            {notifications.length ? (
              notifications.map((notification) => {
                const content = (
                  <div className={cx("flex gap-3 radius-lg p-3 transition hover:bg-surface-base", notification.unread && "bg-brand-primary-soft")}>
                    <span className="mt-1 flex size-8 shrink-0 items-center justify-center radius-full bg-surface-card text-brand">
                      <CheckCircle2 className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="heading-font block text-sm font-bold text-primary">{notification.title}</span>
                      {notification.description ? <span className="mt-1 block text-sm leading-5 text-tertiary">{notification.description}</span> : null}
                      {notification.time ? <span className="mt-1 block text-xs text-tertiary">{notification.time}</span> : null}
                    </span>
                  </div>
                );

                return notification.href ? (
                  <a key={notification.id} className="focus-ring block radius-lg" href={notification.href} onClick={() => setOpen(false)}>
                    {content}
                  </a>
                ) : (
                  <div key={notification.id}>{content}</div>
                );
              })
            ) : (
              <div className="p-6 text-center">
                <p className="heading-font font-bold text-primary">No notifications</p>
                <p className="mt-1 text-sm text-tertiary">Updates and review requests will appear here.</p>
              </div>
            )}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
