"use client";

import { useSearchQuery } from "@/hooks/useSearchQuery";
import { TextField, InputAdornment, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar() {
  const { search, setSearch } = useSearchQuery();

  return (
    <Box className="form-control w-full group">
      <TextField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Quick search across tasks..."
        variant="standard"
        fullWidth
        InputProps={{
          disableUnderline: true,
          className:
            "input input-bordered w-full pr-12 bg-base-100 focus:input-primary transition-all rounded-[1.25rem] font-black h-14 border-2 shadow-sm group-v-focus-within:shadow-xl group-v-focus-within:shadow-primary/5 group-v-focus-within:ring-8 group-v-focus-within:ring-primary/5",
          startAdornment: (
            <InputAdornment position="start" className="pl-4">
              <SearchIcon className="text-primary/40 group-v-focus-within:text-primary transition-colors h-6 w-6" />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
