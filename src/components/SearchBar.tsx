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
            "input! input-bordered! w-full! pr-12 bg-base-100! focus:input-primary! focus:outline-offset-0! transition-all rounded-2xl! font-black h-14 border-2! shadow-sm placeholder:text-base-content/30!",
          startAdornment: (
            <InputAdornment position="start" className="pl-4">
              <SearchIcon className="text-primary/40 group-focus-within:text-primary transition-colors h-6 w-6" />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
