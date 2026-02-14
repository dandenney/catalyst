"use client";

import { useEffect, useRef, useState } from "react";
import type { ContentItem, ContentType } from "@/types/content";

const cache: Partial<Record<ContentType, ContentItem[]>> = {};

const SLUG_MAP: Record<ContentType, string> = {
  courses: "courses",
  projects: "projects",
  assessments: "assessments",
  learning_paths: "learning-paths",
};

export function useContentDataMap(types: ContentType[]) {
  const [dataMap, setDataMap] = useState<
    Partial<Record<ContentType, ContentItem[]>>
  >(() => {
    const initial: Partial<Record<ContentType, ContentItem[]>> = {};
    for (const t of types) {
      if (cache[t]) initial[t] = cache[t];
    }
    return initial;
  });
  const [loading, setLoading] = useState(false);

  const typesKey = [...new Set(types)].sort().join(",");
  const prevKey = useRef(typesKey);

  useEffect(() => {
    const uniqueTypes = [...new Set(types)];
    const toFetch = uniqueTypes.filter((t) => !cache[t]);

    if (toFetch.length === 0) {
      const map: Partial<Record<ContentType, ContentItem[]>> = {};
      for (const t of uniqueTypes) {
        map[t] = cache[t];
      }
      setDataMap(map);
      return;
    }

    setLoading(true);

    Promise.all(
      toFetch.map((t) =>
        fetch(`/api/content/${SLUG_MAP[t]}`)
          .then((r) => r.json())
          .then((data: ContentItem[]) => {
            cache[t] = data;
          }),
      ),
    )
      .then(() => {
        const map: Partial<Record<ContentType, ContentItem[]>> = {};
        for (const t of uniqueTypes) {
          map[t] = cache[t];
        }
        setDataMap(map);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typesKey]);

  return { dataMap, loading };
}
