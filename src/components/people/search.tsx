"use client";

import { TextInput } from "@mantine/core";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
      <TextInput
        id="query"
        placeholder={placeholder}
        onChange={(e) => { handleSearch(e.target.value) }}
        defaultValue={searchParams.get("query")?.toString()}
        style={{flex: 1}}
      />
  );
}
