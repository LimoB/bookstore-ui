import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Your genre structure from the API
export interface Genre {
  genreId: number;
  genreName: string;
  genreCode: string;
  createdAt?: string;
  updatedAt?: string;
}

// If your backend uses camelCase (like Postman sample), no transform is needed
export const genreApi = createApi({
  reducerPath: "genreApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Genre"],
  endpoints: (builder) => ({
    getAllGenres: builder.query<Genre[], void>({
      query: () => "/genres",
      // No transform needed; just validate structure
      transformResponse: (response: unknown): Genre[] => {
        const rawGenres = Array.isArray(response)
          ? response
          : (response as any)?.data;

        if (!Array.isArray(rawGenres)) return [];

        return rawGenres.filter(
          (g): g is Genre =>
            typeof g.genreId === "number" && typeof g.genreName === "string"
        );
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ genreId }) => ({ type: "Genre" as const, id: genreId })),
              { type: "Genre", id: "LIST" },
            ]
          : [{ type: "Genre", id: "LIST" }],
    }),

    getGenreById: builder.query<Genre, number>({
      query: (id) => `/genres/${id}`,
      transformResponse: (response: any): Genre => {
        const raw = response?.data ?? response;
        return raw as Genre;
      },
      providesTags: (_result, _error, id) => [{ type: "Genre", id }],
    }),

    createGenre: builder.mutation<Genre, Partial<Genre>>({
      query: (genre) => ({
        url: "/genres",
        method: "POST",
        body: genre,
      }),
      invalidatesTags: [{ type: "Genre", id: "LIST" }],
    }),

    updateGenre: builder.mutation<Genre, { id: number; data: Partial<Genre> }>({
      query: ({ id, data }) => ({
        url: `/genres/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Genre", id }],
    }),

    deleteGenre: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/genres/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Genre", id },
        { type: "Genre", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllGenresQuery,
  useGetGenreByIdQuery,
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
} = genreApi;
