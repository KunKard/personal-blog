export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function PostEditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
