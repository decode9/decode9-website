export interface CodeFieldProps {
  snippets: readonly string[];
  count: number;
}

export interface FloatingSnippet {
  text: string;
  left: string;
  top?: string;
  duration: string;
  delay: string;
}
