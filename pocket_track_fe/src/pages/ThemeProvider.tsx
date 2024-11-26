import useTheme from '../hooks/useTheme';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useTheme(); // Applica il tema al caricamento dell'app
  return <>{children}</>;
}
