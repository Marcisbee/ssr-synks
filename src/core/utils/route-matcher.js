function keyToPattern(key) {
  const params = [];
  const regexp = key
    .replace(/\/+$/, '')
    .replace(/[^/]?:[^/]+/g, (match) => {
      const name = match.substr(1);

      params.push(name);

      return '([^/]+)';
    });

  return {
    pattern: new RegExp(`^${regexp}$`, 'i'),
    params,
  };
}

export function createMatcher(matches) {
  const patterns = Object.keys(matches).map((key) => [
    keyToPattern(key),
    key,
  ]);

  return (pathRaw) => {
    const path = pathRaw.replace(/\/+$/, '');

    for (const [{ pattern, params }, key] of patterns) {
      const match = path.match(pattern);

      if (match) {
        return {
          key,
          params: params.reduce((acc, param, index) => {
            acc[param] = match[index + 1];

            return acc;
          }, {}),
        };
      }
    }

    return null;
  };
}
