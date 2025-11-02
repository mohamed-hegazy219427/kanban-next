"use client";

import { TextField, InputAdornment, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchQuery } from "@/hooks/useSearchQuery";

export default function SearchBar() {
  const { search, setSearch } = useSearchQuery();

  return (
    <Paper elevation={0} className="p-4 mb-4 bg-white border border-gray-200 rounded-xl shadow-sm">
      <TextField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks by title, description, assignee..."
        variant="outlined"
        size="medium"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="text-gray-400" />
            </InputAdornment>
          ),
          className: "bg-gray-50 rounded-lg",
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "transparent",
            },
            "&:hover fieldset": {
              borderColor: "#3b82f6",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#3b82f6",
            },
          },
        }}
      />
    </Paper>
  );
}
