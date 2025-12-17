export function BoardLayout({
  header,
  children,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 bg-background sticky top-0 z-10">
        {header}
      </div>

      <div className="flex-1 overflow-x-auto p-4">
        {children}
      </div>
    </div>
  );
}
