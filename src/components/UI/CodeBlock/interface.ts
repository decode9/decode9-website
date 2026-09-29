export interface CodeBlockProps {
  code: string;
  /** 1-based lines to highlight (e.g. the line a simulation is executing). */
  highlightLines?: number[];
}
