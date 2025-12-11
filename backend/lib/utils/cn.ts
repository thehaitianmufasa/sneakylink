/**
 * Lightweight class name joiner for Tailwind utility classes.
 */
export function cn(
  ...inputs: Array<string | false | null | undefined | Record<string, boolean> | string[]>
): string {
  const classes: string[] = [];

  inputs.forEach((input) => {
    if (!input) {
      return;
    }

    if (typeof input === 'string') {
      classes.push(input);
      return;
    }

    if (Array.isArray(input)) {
      classes.push(cn(...input));
      return;
    }

    if (typeof input === 'object') {
      Object.entries(input).forEach(([key, value]) => {
        if (value) {
          classes.push(key);
        }
      });
    }
  });

  return classes.join(' ');
}
