import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfileTabsSidebar({
  tab,
  setTab,
  TABS,
  updateUrlWithTab,
}) {
  return (
    <div className="md:w-1/4 min-w-0 w-full">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList
          className="min-w-0 relative items-start justify-center py-2 
            h-fit flex md:flex-col 
            gap-2 overflow-x-auto 
            md:overflow-x-visible
            w-full md:w-auto
            whitespace-nowrap
            scrollbar-thin scrollbar-thumb-muted
            bg-transparent
          "
        >
          <div className="flex md:flex-col gap-4 items-center overflow-x-auto md:overflow-hidden">
            {TABS.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                onClick={() => {
                  setTab(t.value);
                  updateUrlWithTab(t.value);
                }}
                className={`${
                  tab === t.value
                    ? "data-[state=active]:bg-slate-400 text-slate-700"
                    : "bg-muted text-muted-foreground"
                } px-3 py-2 w-28 rounded-md transition whitespace-nowrap`}
              >
                {t.label}
              </TabsTrigger>
            ))}
          </div>
        </TabsList>
      </Tabs>
    </div>
  );
}
